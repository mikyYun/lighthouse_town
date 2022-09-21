
/**
 * Module dependencies.
 */

var uid2 = require('uid2');
var pg = require('pg');
var msgpack = require('notepack.io');
var Adapter = require('socket.io-adapter');
var debug = require('debug')('socket.io-adapter-postgres');
var _ = require('lodash');

/**
 * Module exports.
 */

module.exports = adapter;

/**
 * Request types, for messages between nodes
 */

var requestTypes = {
  clients: 0,
  clientRooms: 1,
  allRooms: 2,
  remoteJoin: 3,
  remoteLeave: 4,
  customRequest: 5,
  remoteDisconnect: 6
};

/**
 * Returns a PostgreSQL Adapter class.
 *
 * @param {String} optional, redis uri
 * @return {PostgreSQL} adapter
 * @api public
 */

function adapter(uri, opts) {
  opts = opts || {};

  // handle options only
  if ('object' == typeof uri) {
    opts = uri;
    uri = null;
  }

  // opts
  var pub = opts.pubClient;
  var sub = opts.subClient;
  var prefix = opts.key || 'socket.io';
  var requestsTimeout = opts.requestsTimeout || 5000;

  // init clients if needed
  if (!pub) {
    pub = new pg.Pool(uri || opts);
  }
  if (!sub) {
    sub = new pg.Client(uri || opts);
    sub.connect();
  }

  // this server's key
  var uid = uid2(6);

  /**
   * Adapter constructor.
   *
   * @param {String} namespace name
   * @api public
   */

  function PostgreSQL(nsp){
    Adapter.call(this, nsp);

    this.uid = uid;
    this.prefix = prefix;
    this.requestsTimeout = requestsTimeout;

    this.channel = prefix + '#' + nsp.name + '#';
    this.requestChannel = prefix + '-request#' + this.nsp.name + '#';
    this.responseChannel = prefix + '-response#' + this.nsp.name + '#';
    this.requests = {};
    this.customHook = function(data, cb){ cb(null); }

    if (String.prototype.startsWith) {
      this.channelMatches = function (messageChannel, subscribedChannel) {
        return messageChannel.startsWith(subscribedChannel);
      }
    } else { // Fallback to other impl for older Node.js
      this.channelMatches = function (messageChannel, subscribedChannel) {
        return messageChannel.substr(0, subscribedChannel.length) === subscribedChannel;
      }
    }
    this.pubClient = pub;
    this.subClient = sub;

    var self = this;

    sub.query('SELECT set_config(\'application_name\', $1::TEXT, false)', ['socket.io-' + this.requestChannel], function(err) {
      if (err) self.emit('error', err);
    });
    sub.query('LISTEN socketio', function(err) {
      if (err) self.emit('error', err);
    });

    // Object whose keys are (arbitrary) payload ids and whose values are arrays that get built as
    // chunks come in.
    var rechunker = {};

    sub.on('notification', function(msg) {
      var payload = JSON.parse(msg.payload);
      if (_.startsWith(payload[1], '_chunk_')) {
        var header = _.trim(payload[1].substring(0, 50)).split('_');
        var payloadid = header[2];
        var chunkIndex = _.parseInt(header[3]);
        if (!rechunker[payloadid]) {
          rechunker[payloadid] = [];
          setTimeout(function () {
            // no reason why the entire payload should not have arrived within a minute.
            // prevent memory leak
            if (rechunker[payloadid]) {
              delete rechunker[payloadid];
            }
          }, 60000);
        }
        var data = payload[1].substring(50);
        rechunker[payloadid][chunkIndex] = data;
        var isAllDataIn = _.compact(rechunker[payloadid]).length === _.parseInt(header[4]);
        if (isAllDataIn) {
          var rebuiltPayload = rechunker[payloadid].join('');
          delete rechunker[payloadid];
          self.onmessage(payload[0], rebuiltPayload);
          self.onrequest(payload[0], rebuiltPayload);
        }

      } else {
        self.onmessage(payload[0], payload[1]);
        self.onrequest(payload[0], payload[1]);
      }
    });

    this._publish = function(channel, payload) {
      if (payload.length > 8000) {
        // https://jsperf.com/string-split-by-length/3
        var chunks = payload.match(new RegExp('[\\s\\S]{1,5000}', 'g'));
        var payloadid = uid2(6);
        for (var i = 0; i < chunks.length; i++) {
          var header = _.padEnd('_chunk_' + payloadid + '_' + i + '_' + chunks.length, 50);
          var chunk = header + chunks[i];
          pub.query('SELECT pg_notify(\'socketio\', $1::TEXT)', [JSON.stringify([channel, chunk])]);
        }
      } else {
        pub.query('SELECT pg_notify(\'socketio\', $1::TEXT)', [JSON.stringify([channel, payload])]);
      }
    };

    this._numsub = function(channel, callback) {
      pub.query('SELECT COUNT(*) c FROM pg_stat_activity WHERE application_name = $1::TEXT', ['socket.io-' + channel], function(err, res) {
        callback(err, res && res.rows && res.rows[0] && res.rows[0].c);
      });
    }

    function onError(err) {
      self.emit('error', err);
    }
    pub.on('error', onError);
    pub.on('connect', function(client) {
      client.on('error', onError);
    });
    sub.on('error', onError);
  }

  /**
   * Inherits from `Adapter`.
   */

  PostgreSQL.prototype.__proto__ = Adapter.prototype;

  /**
   * Called with a subscription message
   *
   * @api private
   */

  PostgreSQL.prototype.onmessage = function(channel, msg){
    channel = channel.toString();

    if (!this.channelMatches(channel, this.channel)) {
      return debug('ignore different channel');
    }

    var room = channel.slice(this.channel.length, -1);
    if (room !== '' && !this.rooms.hasOwnProperty(room)) {
      return debug('ignore unknown room %s', room);
    }

    var args = msgpack.decode(Buffer.from(msg, 'base64'));
    var packet;

    if (uid === args.shift()) return debug('ignore same uid');

    packet = args[0];

    if (packet && packet.nsp === undefined) {
      packet.nsp = '/';
    }

    if (!packet || packet.nsp != this.nsp.name) {
      return debug('ignore different namespace');
    }

    args.push(true);

    this.broadcast.apply(this, args);
  };

  /**
   * Called on request from another node
   *
   * @api private
   */

  PostgreSQL.prototype.onrequest = function(channel, msg){
    channel = channel.toString();

    if (this.channelMatches(channel, this.responseChannel)) {
      return this.onresponse(channel, msg);
    } else if (!this.channelMatches(channel, this.requestChannel)) {
      return debug('ignore different channel');
    }

    var self = this;
    var request;

    try {
      request = JSON.parse(msg);
    } catch(err){
      self.emit('error', err);
      return;
    }

    debug('received request %j', request);

    switch (request.type) {

      case requestTypes.clients:
        Adapter.prototype.clients.call(self, request.rooms, function(err, clients){
          if(err){
            self.emit('error', err);
            return;
          }

          var response = JSON.stringify({
            requestid: request.requestid,
            clients: clients
          });

          self._publish(self.responseChannel, response);
        });
        break;

      case requestTypes.clientRooms:
        Adapter.prototype.clientRooms.call(self, request.sid, function(err, rooms){
          if(err){
            self.emit('error', err);
            return;
          }

          if (!rooms) { return; }

          var response = JSON.stringify({
            requestid: request.requestid,
            rooms: rooms
          });

          self._publish(self.responseChannel, response);
        });
        break;

      case requestTypes.allRooms:

        var response = JSON.stringify({
          requestid: request.requestid,
          rooms: Object.keys(this.rooms)
        });

        self._publish(self.responseChannel, response);
        break;

      case requestTypes.remoteJoin:

        var socket = this.nsp.connected[request.sid];
        if (!socket) { return; }

        socket.join(request.room, function(){
          var response = JSON.stringify({
            requestid: request.requestid
          });

          self._publish(self.responseChannel, response);
        });
        break;

      case requestTypes.remoteLeave:

        var socket = this.nsp.connected[request.sid];
        if (!socket) { return; }

        socket.leave(request.room, function(){
          var response = JSON.stringify({
            requestid: request.requestid
          });

          self._publish(self.responseChannel, response);
        });
        break;

      case requestTypes.remoteDisconnect:

        var socket = this.nsp.connected[request.sid];
        if (!socket) { return; }

        socket.disconnect(request.close);

        var response = JSON.stringify({
          requestid: request.requestid
        });

        self._publish(self.responseChannel, response);
        break;

      case requestTypes.customRequest:
        this.customHook(request.data, function(data) {

          var response = JSON.stringify({
            requestid: request.requestid,
            data: data
          });

          self._publish(self.responseChannel, response);
        });

        break;

      default:
        debug('ignoring unknown request type: %s', request.type);
    }
  };

  /**
   * Called on response from another node
   *
   * @api private
   */

  PostgreSQL.prototype.onresponse = function(channel, msg){
    var self = this;
    var response;

    try {
      response = JSON.parse(msg);
    } catch(err){
      self.emit('error', err);
      return;
    }

    var requestid = response.requestid;

    if (!requestid || !self.requests[requestid]) {
      debug('ignoring unknown request');
      return;
    }

    debug('received response %j', response);

    var request = self.requests[requestid];

    switch (request.type) {

      case requestTypes.clients:
        request.msgCount++;

        // ignore if response does not contain 'clients' key
        if(!response.clients || !Array.isArray(response.clients)) return;

        for(var i = 0; i < response.clients.length; i++){
          request.clients[response.clients[i]] = true;
        }

        if (request.msgCount === request.numsub) {
          clearTimeout(request.timeout);
          if (request.callback) process.nextTick(request.callback.bind(null, null, Object.keys(request.clients)));
          delete self.requests[requestid];
        }
        break;

      case requestTypes.clientRooms:
        clearTimeout(request.timeout);
        if (request.callback) process.nextTick(request.callback.bind(null, null, response.rooms));
        delete self.requests[requestid];
        break;

      case requestTypes.allRooms:
        request.msgCount++;

        // ignore if response does not contain 'rooms' key
        if(!response.rooms || !Array.isArray(response.rooms)) return;

        for(var i = 0; i < response.rooms.length; i++){
          request.rooms[response.rooms[i]] = true;
        }

        if (request.msgCount === request.numsub) {
          clearTimeout(request.timeout);
          if (request.callback) process.nextTick(request.callback.bind(null, null, Object.keys(request.rooms)));
          delete self.requests[requestid];
        }
        break;

      case requestTypes.remoteJoin:
      case requestTypes.remoteLeave:
      case requestTypes.remoteDisconnect:
        clearTimeout(request.timeout);
        if (request.callback) process.nextTick(request.callback.bind(null, null));
        delete self.requests[requestid];
        break;

      case requestTypes.customRequest:
        request.msgCount++;

        request.replies.push(response.data);

        if (request.msgCount === request.numsub) {
          clearTimeout(request.timeout);
          if (request.callback) process.nextTick(request.callback.bind(null, null, request.replies));
          delete self.requests[requestid];
        }
        break;

      default:
        debug('ignoring unknown request type: %s', request.type);
    }
  };

  /**
   * Broadcasts a packet.
   *
   * @param {Object} packet to emit
   * @param {Object} options
   * @param {Boolean} whether the packet came from another node
   * @api public
   */

  PostgreSQL.prototype.broadcast = function(packet, opts, remote){
    packet.nsp = this.nsp.name;
    if (!(remote || (opts && opts.flags && opts.flags.local))) {
      var msg = msgpack.encode([uid, packet, opts]).toString('base64');
      var channel = this.channel;
      if (opts.rooms && opts.rooms.length === 1) {
        channel += opts.rooms[0] + '#';
      }
      debug('publishing message to channel %s', channel);
      this._publish(channel, msg);
    }
    Adapter.prototype.broadcast.call(this, packet, opts);
  };

  /**
   * Gets a list of clients by sid.
   *
   * @param {Array} explicit set of rooms to check.
   * @param {Function} callback
   * @api public
   */

  PostgreSQL.prototype.clients = function(rooms, fn){
    if ('function' == typeof rooms){
      fn = rooms;
      rooms = null;
    }

    rooms = rooms || [];

    var self = this;
    var requestid = uid2(6);

    self._numsub(self.requestChannel, function(err, numsub){
      if (err) {
        self.emit('error', err);
        if (fn) fn(err);
        return;
      }

      debug('waiting for %d responses to "clients" request', numsub);

      var request = JSON.stringify({
        requestid : requestid,
        type: requestTypes.clients,
        rooms : rooms
      });

      // if there is no response for x second, return result
      var timeout = setTimeout(function() {
        var request = self.requests[requestid];
        if (fn) process.nextTick(fn.bind(null, new Error('timeout reached while waiting for clients response'), Object.keys(request.clients)));
        delete self.requests[requestid];
      }, self.requestsTimeout);

      self.requests[requestid] = {
        type: requestTypes.clients,
        numsub: numsub,
        msgCount: 0,
        clients: {},
        callback: fn,
        timeout: timeout
      };

      self._publish(self.requestChannel, request);
    });
  };

  /**
   * Gets the list of rooms a given client has joined.
   *
   * @param {String} client id
   * @param {Function} callback
   * @api public
   */

  PostgreSQL.prototype.clientRooms = function(id, fn){

    var self = this;
    var requestid = uid2(6);

    var rooms = this.sids[id];

    if (rooms) {
      if (fn) process.nextTick(fn.bind(null, null, Object.keys(rooms)));
      return;
    }

    var request = JSON.stringify({
      requestid : requestid,
      type: requestTypes.clientRooms,
      sid : id
    });

    // if there is no response for x second, return result
    var timeout = setTimeout(function() {
      if (fn) process.nextTick(fn.bind(null, new Error('timeout reached while waiting for rooms response')));
      delete self.requests[requestid];
    }, self.requestsTimeout);

    self.requests[requestid] = {
      type: requestTypes.clientRooms,
      callback: fn,
      timeout: timeout
    };

    self._publish(self.requestChannel, request);
  };

  /**
   * Gets the list of all rooms (accross every node)
   *
   * @param {Function} callback
   * @api public
   */

  PostgreSQL.prototype.allRooms = function(fn){

    var self = this;
    var requestid = uid2(6);

    self._numsub(self.requestChannel, function(err, numsub){
      if (err) {
        self.emit('error', err);
        if (fn) fn(err);
        return;
      }

      debug('waiting for %d responses to "allRooms" request', numsub);

      var request = JSON.stringify({
        requestid : requestid,
        type: requestTypes.allRooms
      });

      // if there is no response for x second, return result
      var timeout = setTimeout(function() {
        var request = self.requests[requestid];
        if (fn) process.nextTick(fn.bind(null, new Error('timeout reached while waiting for allRooms response'), Object.keys(request.rooms)));
        delete self.requests[requestid];
      }, self.requestsTimeout);

      self.requests[requestid] = {
        type: requestTypes.allRooms,
        numsub: numsub,
        msgCount: 0,
        rooms: {},
        callback: fn,
        timeout: timeout
      };

      self._publish(self.requestChannel, request);
    });
  };

  /**
   * Makes the socket with the given id join the room
   *
   * @param {String} socket id
   * @param {String} room name
   * @param {Function} callback
   * @api public
   */

  PostgreSQL.prototype.remoteJoin = function(id, room, fn){

    var self = this;
    var requestid = uid2(6);

    var socket = this.nsp.connected[id];
    if (socket) {
      socket.join(room, fn);
      return;
    }

    var request = JSON.stringify({
      requestid : requestid,
      type: requestTypes.remoteJoin,
      sid: id,
      room: room
    });

    // if there is no response for x second, return result
    var timeout = setTimeout(function() {
      if (fn) process.nextTick(fn.bind(null, new Error('timeout reached while waiting for remoteJoin response')));
      delete self.requests[requestid];
    }, self.requestsTimeout);

    self.requests[requestid] = {
      type: requestTypes.remoteJoin,
      callback: fn,
      timeout: timeout
    };

    self._publish(self.requestChannel, request);
  };

  /**
   * Makes the socket with the given id leave the room
   *
   * @param {String} socket id
   * @param {String} room name
   * @param {Function} callback
   * @api public
   */

  PostgreSQL.prototype.remoteLeave = function(id, room, fn){

    var self = this;
    var requestid = uid2(6);

    var socket = this.nsp.connected[id];
    if (socket) {
      socket.leave(room, fn);
      return;
    }

    var request = JSON.stringify({
      requestid : requestid,
      type: requestTypes.remoteLeave,
      sid: id,
      room: room
    });

    // if there is no response for x second, return result
    var timeout = setTimeout(function() {
      if (fn) process.nextTick(fn.bind(null, new Error('timeout reached while waiting for remoteLeave response')));
      delete self.requests[requestid];
    }, self.requestsTimeout);

    self.requests[requestid] = {
      type: requestTypes.remoteLeave,
      callback: fn,
      timeout: timeout
    };

    self._publish(self.requestChannel, request);
  };

  /**
   * Makes the socket with the given id to be disconnected forcefully
   * @param {String} socket id
   * @param {Boolean} close if `true`, closes the underlying connection
   * @param {Function} callback
   */

  PostgreSQL.prototype.remoteDisconnect = function(id, close, fn) {
    var self = this;
    var requestid = uid2(6);

    var socket = this.nsp.connected[id];
    if(socket) {
      socket.disconnect(close);
      if (fn) process.nextTick(fn.bind(null, null));
      return;
    }

    var request = JSON.stringify({
      requestid : requestid,
      type: requestTypes.remoteDisconnect,
      sid: id,
      close: close
    });

    // if there is no response for x second, return result
    var timeout = setTimeout(function() {
      if (fn) process.nextTick(fn.bind(null, new Error('timeout reached while waiting for remoteDisconnect response')));
      delete self.requests[requestid];
    }, self.requestsTimeout);

    self.requests[requestid] = {
      type: requestTypes.remoteDisconnect,
      callback: fn,
      timeout: timeout
    };

    self._publish(self.requestChannel, request);
  };

  /**
   * Sends a new custom request to other nodes
   *
   * @param {Object} data (no binary)
   * @param {Function} callback
   * @api public
   */

  PostgreSQL.prototype.customRequest = function(data, fn){
    if (typeof data === 'function'){
      fn = data;
      data = null;
    }

    var self = this;
    var requestid = uid2(6);

    self._numsub(self.requestChannel, function(err, numsub){
      if (err) {
        self.emit('error', err);
        if (fn) fn(err);
        return;
      }

      debug('waiting for %d responses to "customRequest" request', numsub);

      var request = JSON.stringify({
        requestid : requestid,
        type: requestTypes.customRequest,
        data: data
      });

      // if there is no response for x second, return result
      var timeout = setTimeout(function() {
        var request = self.requests[requestid];
        if (fn) process.nextTick(fn.bind(null, new Error('timeout reached while waiting for customRequest response'), request.replies));
        delete self.requests[requestid];
      }, self.requestsTimeout);

      self.requests[requestid] = {
        type: requestTypes.customRequest,
        numsub: numsub,
        msgCount: 0,
        replies: [],
        callback: fn,
        timeout: timeout
      };

      self._publish(self.requestChannel, request);
    });
  };

  PostgreSQL.uid = uid;
  PostgreSQL.pubClient = pub;
  PostgreSQL.subClient = sub;
  PostgreSQL.prefix = prefix;
  PostgreSQL.requestsTimeout = requestsTimeout;

  return PostgreSQL;

}
