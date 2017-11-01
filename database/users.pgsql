--
-- PostgreSQL database dump
--

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
-- Name: users; Type: TABLE; Schema: public; Owner: Jordan
--

DROP DATABASE IF EXISTS users;
CREATE DATABASE users;

\c users;

CREATE TABLE users (
    id integer NOT NULL,
    interests json,
    score_sum integer,
    session_entries integer,
    user_name text,
    age integer,
    gender text,
    location text,
    average numeric,
    average_at timestamp without time zone
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
-- Name: users id; Type: DEFAULT; Schema: public; Owner: Jordan
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: Jordan
--

COPY users (id, interests, score_sum, session_entries, user_name, age, gender, location, average, average_at) FROM stdin;
123	{"technology":0.7,"skateboarding":0.25,"supreme":0.25,"noodels":0.5}	\N	\N	Jordan	1	male	sf	\N	\N
1234	{"technology":0.4,"skateboarding":0.25,"supreme":0.5,"noodels":0.25}	\N	\N	Tim	1	male	sf	\N	\N
12345	{"technology":0.2,"skateboarding":0.5,"supreme":0.25,"noodels":0.25}	\N	\N	Devon	1	male	sf	\N	\N
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Jordan
--

SELECT pg_catalog.setval('users_id_seq', 1, false);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: Jordan
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

