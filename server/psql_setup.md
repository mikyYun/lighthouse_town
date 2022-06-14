1. psql 로그인 (labber)
* MOON: $ psql --u labber (password: 123)
* $ vagrant
* $ psql (비번.. 보통 123 아니면 labber)

2. superuser 생성
* psql:
* $ CREATE USER coding_buddy WITH SUPERUSER PASSWORD '123';
* $ \du => 현재 유저 리스트 확인

3. database 생성
* psql:
* $ CREATE DATABASE coding_buddy;
* $ \l => coding_buddy db 생성 확인

4. psql 종료 후 coding_buddy 유저로 coding_buddy 데이터베이스 로그인
* $ vagrant
* psql 에 -d 데이터베이스 coding_buddy 에 -U 유저 coding_buddy 로 로그인 하겠습니다
* 비밀번호 123
* $ psql -d coding_buddy -U coding_buddy
* 로그인 후에 psql 에서 coding_buddy=# 으로 시작해야함
* 연결 체크
* $ \conninfo 또는 $ \c => ~데이터베이스에 유저 ~로 연결되어있음 출력됨

5. 필요없는 테이블 삭제
* coding_buddy=#
* $ \dt => 지금 데이터베이스에 존재하는 테이블 확인
* 테이블 삭제
* $ DROP TABLE <tablename>;

6. server 폴더에서 node-postgress 설치
* $ npm i pg dotenv

7. server 폴더에 .env 파일 만들어서
PGUSER=coding_buddy
PGHOST=localhost
PGDATABASE=coding_buddy
PGPASSWORD=123
PGPORT=5432

DATABASE_URL=
^^db url 은 나중에..
