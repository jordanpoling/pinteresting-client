
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
    score_sum numeric DEFAULT '0'::numeric,
    session_entries integer DEFAULT 0,
    user_name text,
    age integer DEFAULT 0,
    gender text,
    location text,
    average numeric,
    average_at timestamp without time zone,
    ratio_threshold numeric,
    pin_click_freq numeric
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

COPY users (id, interests, score_sum, session_entries, user_name, age, gender, location, average, average_at, ratio_threshold, pin_click_freq) FROM stdin;
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
