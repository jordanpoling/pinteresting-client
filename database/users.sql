-- Dumped from database version 9.6.5
-- Dumped by pg_dump version 9.6.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: engagement; Type: TABLE; Schema: public; Owner: Jordan
--

DROP DATABASE IF EXISTS users;
CREATE DATABASE users;

\c users;

CREATE TABLE engagement (
    id integer NOT NULL,
    score numeric,
    user_id integer,
    "time" timestamp
);


ALTER TABLE engagement OWNER TO "Jordan";

--
-- Name: untitled_table_id_seq; Type: SEQUENCE; Schema: public; Owner: Jordan
--

CREATE SEQUENCE untitled_table_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE untitled_table_id_seq OWNER TO "Jordan";

--
-- Name: untitled_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Jordan
--

ALTER SEQUENCE untitled_table_id_seq OWNED BY engagement.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: Jordan
--

CREATE TABLE users (
    id integer NOT NULL,
    user_name text,
    age integer,
    gender text,
    location text,
    average_score numeric,
    score_time timestamp
);


ALTER TABLE users OWNER TO "Jordan";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: Jordan
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO "Jordan";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Jordan
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: engagement id; Type: DEFAULT; Schema: public; Owner: Jordan
--

ALTER TABLE ONLY engagement ALTER COLUMN id SET DEFAULT nextval('untitled_table_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: Jordan
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: engagement; Type: TABLE DATA; Schema: public; Owner: Jordan
--

COPY engagement (id, score, user_id, "time") FROM stdin;
\.


--
-- Name: untitled_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Jordan
--

SELECT pg_catalog.setval('untitled_table_id_seq', 1, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Jordan
--

COPY users (id, user_name, age, gender, location) FROM stdin;
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Jordan
--

SELECT pg_catalog.setval('users_id_seq', 1, false);


--
-- Name: engagement untitled_table_pkey; Type: CONSTRAINT; Schema: public; Owner: Jordan
--

ALTER TABLE ONLY engagement
    ADD CONSTRAINT untitled_table_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: Jordan
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: engagement engagement_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Jordan
--

ALTER TABLE ONLY engagement
    ADD CONSTRAINT engagement_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--