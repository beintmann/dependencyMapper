SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;



CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;



COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;



CREATE TABLE public."Anwendung"
(
    "Bezeichnung"   text                                            NOT NULL,
    "Technologie"   character varying,
    "Kunde"         character varying,
    "MetadatenUUID" character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    "CI"            integer,
    "URL"           character varying,
    "Netzzone"      character varying
);


ALTER TABLE public."Anwendung"
    OWNER TO "user";



CREATE SEQUENCE public."Anwendung_AnwendungID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Anwendung_AnwendungID_seq" OWNER TO "user";



ALTER SEQUENCE public."Anwendung_AnwendungID_seq" OWNED BY public."Anwendung"."MetadatenUUID";



CREATE TABLE public."Anwendung_Datenbank"
(
    name_datenbank character varying,
    "AnwendungID"  character varying(36)
);


ALTER TABLE public."Anwendung_Datenbank"
    OWNER TO "user";



CREATE TABLE public."DB_Instanz"
(
    "Instanz"            character varying NOT NULL,
    "ServerID/InstanzCI" character varying,
    "ServerID"           integer,
    "Typ"                character varying,
    "DB_Version"         character varying
);


ALTER TABLE public."DB_Instanz"
    OWNER TO "user";



CREATE TABLE public."Datenbank"
(
    "Name/Instanz-CI" character varying,
    "DB_Instanz"      character varying,
    "Name"            character varying NOT NULL
);


ALTER TABLE public."Datenbank"
    OWNER TO "user";



CREATE TABLE public."Datensatz"
(
    "DatensatzID"    character varying(36) NOT NULL,
    "Bezeichnung"    text                  NOT NULL,
    "Schema"         character varying,
    "Typ"            character varying,
    "Kunde"          character varying,
    "Datenbank_Name" character varying
);


ALTER TABLE public."Datensatz"
    OWNER TO "user";



CREATE SEQUENCE public."Datensatz_DatensatzID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Datensatz_DatensatzID_seq" OWNER TO "user";



ALTER SEQUENCE public."Datensatz_DatensatzID_seq" OWNED BY public."Datensatz"."DatensatzID";



CREATE TABLE public."Datensatz_Dienst"
(
    "DatensatzID" character varying(36) NOT NULL,
    "DienstID"    character varying(36) NOT NULL
);


ALTER TABLE public."Datensatz_Dienst"
    OWNER TO "user";



CREATE TABLE public."Dienst"
(
    "Bezeichnung"   text                                            NOT NULL,
    "Typ"           character varying,
    "URL"           character varying,
    gesichert       boolean,
    "MetadatenUUID" character varying(36) DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public."Dienst"
    OWNER TO "user";



CREATE TABLE public."Dienst_Anwendung"
(
    "DienstID"    character varying(36) NOT NULL,
    "AnwendungID" character varying(36) NOT NULL
);


ALTER TABLE public."Dienst_Anwendung"
    OWNER TO "user";



CREATE SEQUENCE public."Dienst_DienstID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Dienst_DienstID_seq" OWNER TO "user";



ALTER SEQUENCE public."Dienst_DienstID_seq" OWNED BY public."Dienst"."MetadatenUUID";



CREATE TABLE public."Dienst_Server"
(
    "ServerID" integer,
    "DienstID" character varying(36)
);


ALTER TABLE public."Dienst_Server"
    OWNER TO "user";



CREATE TABLE public."Server"
(
    "ServerID" integer           NOT NULL,
    "Name"     character varying NOT NULL
);


ALTER TABLE public."Server"
    OWNER TO "user";



CREATE TABLE public."Server_Anwendung"
(
    "ServerID"    integer               NOT NULL,
    "AnwendungID" character varying(36) NOT NULL
);


ALTER TABLE public."Server_Anwendung"
    OWNER TO "user";



ALTER TABLE ONLY public."Datensatz"
    ALTER COLUMN "DatensatzID" SET DEFAULT nextval('public."Datensatz_DatensatzID_seq"'::regclass);



COPY public."Anwendung" ("Bezeichnung", "Technologie", "Kunde", "MetadatenUUID", "CI", "URL", "Netzzone") FROM stdin;
Stadtportal	Masterportal	\N	1	\N	\N	\N
Fachportal Feuerwehr	Masterportal	\N	2	\N	\N	\N
Fachportal Kampfmittel	Masterportal	32	3	\N	https://koelngis.verwaltung.stadtkoeln.de/koelngis/portale/kampfmittel_32/index.php	WebDMZ
Internetkarte Denkmalliste	Masterportal	48	4	\N	https://koelngis.stadt-koeln.de/koelngis/portale/denkmalliste/index.html	CAN
IT-Standorte	\N	\N	c9e31af2-30ea-4c50-8793-e62caabcab32	\N	\N	\N
\.


COPY public."Anwendung_Datenbank" (name_datenbank, "AnwendungID") FROM stdin;
\.


COPY public."DB_Instanz" ("Instanz", "ServerID/InstanzCI", "ServerID", "Typ", "DB_Version") FROM stdin;
UMNPROD-KVMUD866	\N	\N	\N	Postgre13
UMNPROD1-KVMUD864	\N	\N	\N	Postgre13
\.


COPY public."Datenbank" ("Name/Instanz-CI", "DB_Instanz", "Name") FROM stdin;
UMNPROD1-KVMUD864	\N	poi_prod
UMNPROD-KVMUD866	\N	amt62geodaten_prod
UMNPROD1-KVMUD864	\N	kps_prod
\N	\N	statistik_prod
\N	\N	cyclomedia_prod
\.


COPY public."Datensatz" ("DatensatzID", "Bezeichnung", "Schema", "Typ", "Kunde", "Datenbank_Name") FROM stdin;
1	Testdatensatz1	Schema1	View	Bob	\N
2	Tabelle_1 	Schema1	Tabelle	Justus	\N
3	Tabelle_2	Schema2	Tabelle	Justus	\N
4	Tabelle_3	Schema2	Tabelle	Gisela	\N
7	Stadtviertel	statistik_prod_admin.KölnRBS	Tabelle (Enterprise GDB)	15	statistik_prod
8	Statistisches_Quartier	statistik_prod_admin.KölnRBS	Tabelle (Enterprise GDB)	15	statistik_prod
9	Stadtteil	statistik_prod_admin.KölnRBS	Tabelle (Enterprise GDB)	15	statistik_prod
10	Stadtbezirk	statistik_prod_admin.KölnRBS	Tabelle (Enterprise GDB)	15	statistik_prod
11	Stadt_Koeln	statistik_prod_admin.KölnRBS	Tabelle (Enterprise GDB)	15	statistik_prod
12	Strassenknoten	statistik_prod_admin.KölnRBS	Tabelle (Enterprise GDB)	15	statistik_prod
13	Strassenabschnitt	statistik_prod_admin.KölnRBS	Tabelle (Enterprise GDB)	15	statistik_prod
14	it_standorte_infos	amt12	Tabelle (PostGIS)	12	poi_prod
15	it_servicecalls_schule_kita	amt12	Tabelle (PostGIS)	12	poi_prod
17	aufnahmepunkte_2024	public	Tabelle (PostGIS)	12	cyclomedia_prod
\.


COPY public."Datensatz_Dienst" ("DatensatzID", "DienstID") FROM stdin;
2	1
3	1
1	2
4	2
1	1
8	6
9	6
10	6
11	6
12	6
13	6
15	10
14	10
14	7
15	7
7	9
8	9
9	9
10	9
11	9
12	9
13	9
17	8
\.


COPY public."Dienst" ("Bezeichnung", "Typ", "URL", gesichert, "MetadatenUUID") FROM stdin;
Dienst1	WMS	www.schickimicki.de	t	1
Dienst2	WFS	www.pingpongdingdong.de	f	2
RVR Stadtplanwerk	WMS	https://geodaten.metropoleruhr.de/spw2	f	3
Adressbestand Köln	WMS	https://geoportal.verwaltung.stadtkoeln.de/maps/services/offen15/adressen_gesamt/MapServer/WMSServer	f	5
Kommunale Gebietsgliederung Köln	WMS	https://geoportal.verwaltung.stadtkoeln.de/maps/services/offen15/KGG_labeled/MapServer/WMSServer	f	6
IT-Standorte	WMS	https://geoportal.verwaltung.stadtkoeln.de/wss/service/it_standorte_infos_wms/sso	t	7
Aufnahmepunkte Panoramabilder	WMS	https://geoportal.verwaltung.stadtkoeln.de/wss/service/cyclorama_wms/guest	f	8
Kommunale Gebietsgliederung Köln	WFS	https://geoportal.verwaltung.stadtkoeln.de/maps/services/offen15/KGG_labeled/MapServer/WFSServer	f	9
IT-Standorte	WFS	https://geoportal.verwaltung.stadtkoeln.de/wss/service/it_standorte_infos_wfs/sso	t	10
Historische Stadtkarten	WMS	https://geoportal.stadt-koeln.de/wss/service/historische_stadtkarten/guest	f	11
Denkmalliste	WMS	https://geoportal.stadt-koeln.de/wss/service/denkmalliste_wms/guest	f	12
Digitale Orthofotos NRW	WMS	https://www.wms.nrw.de/geobasis/wms_nw_dop	f	13
RVR Stadtplanwerk	WMS	https://geodaten.metropoleruhr.de/spw2	f	14
\.


COPY public."Dienst_Anwendung" ("DienstID", "AnwendungID") FROM stdin;
1	1
1	2
2	1
12	4
11	4
13	4
14	4
3	c9e31af2-30ea-4c50-8793-e62caabcab32
5	c9e31af2-30ea-4c50-8793-e62caabcab32
6	c9e31af2-30ea-4c50-8793-e62caabcab32
7	c9e31af2-30ea-4c50-8793-e62caabcab32
8	c9e31af2-30ea-4c50-8793-e62caabcab32
9	c9e31af2-30ea-4c50-8793-e62caabcab32
10	c9e31af2-30ea-4c50-8793-e62caabcab32
13	c9e31af2-30ea-4c50-8793-e62caabcab32
14	c9e31af2-30ea-4c50-8793-e62caabcab32
\.


COPY public."Dienst_Server" ("ServerID", "DienstID") FROM stdin;
\.


COPY public."Server" ("ServerID", "Name") FROM stdin;
\.


COPY public."Server_Anwendung" ("ServerID", "AnwendungID") FROM stdin;
\.


SELECT pg_catalog.setval('public."Anwendung_AnwendungID_seq"', 5, true);



SELECT pg_catalog.setval('public."Datensatz_DatensatzID_seq"', 17, true);



SELECT pg_catalog.setval('public."Dienst_DienstID_seq"', 14, true);



ALTER TABLE ONLY public."Anwendung"
    ADD CONSTRAINT "Anwendung_pkey" PRIMARY KEY ("MetadatenUUID");



ALTER TABLE ONLY public."DB_Instanz"
    ADD CONSTRAINT "DB_Instanz_pkey" PRIMARY KEY ("Instanz");



ALTER TABLE ONLY public."Datenbank"
    ADD CONSTRAINT "Datenbank_pkey" PRIMARY KEY ("Name");



ALTER TABLE ONLY public."Datensatz_Dienst"
    ADD CONSTRAINT "Datensatz_Dienst_pkey" PRIMARY KEY ("DatensatzID", "DienstID");



ALTER TABLE ONLY public."Datensatz"
    ADD CONSTRAINT "Datensatz_pkey" PRIMARY KEY ("DatensatzID");



ALTER TABLE ONLY public."Dienst_Anwendung"
    ADD CONSTRAINT "Dienst_Anwendung_pkey" PRIMARY KEY ("DienstID", "AnwendungID");



ALTER TABLE ONLY public."Dienst"
    ADD CONSTRAINT "Dienst_pkey" PRIMARY KEY ("MetadatenUUID");



ALTER TABLE ONLY public."Server_Anwendung"
    ADD CONSTRAINT "Server_Anwendung_pkey" PRIMARY KEY ("AnwendungID", "ServerID");



ALTER TABLE ONLY public."Server"
    ADD CONSTRAINT "Server_pkey" PRIMARY KEY ("ServerID");



ALTER TABLE ONLY public."Anwendung_Datenbank"
    ADD CONSTRAINT "Anwendung_Datenbank_AnwendungID_fkey" FOREIGN KEY ("AnwendungID") REFERENCES public."Anwendung" ("MetadatenUUID");



ALTER TABLE ONLY public."Anwendung_Datenbank"
    ADD CONSTRAINT "Anwendung_Datenbank_name_datenbank_fkey" FOREIGN KEY (name_datenbank) REFERENCES public."Datenbank" ("Name");



ALTER TABLE ONLY public."DB_Instanz"
    ADD CONSTRAINT "DB_Instanz_ServerID_fkey" FOREIGN KEY ("ServerID") REFERENCES public."Server" ("ServerID");



ALTER TABLE ONLY public."Datenbank"
    ADD CONSTRAINT "Datenbank_DB_Instanz_fkey" FOREIGN KEY ("DB_Instanz") REFERENCES public."DB_Instanz" ("Instanz") NOT VALID;



ALTER TABLE ONLY public."Datensatz"
    ADD CONSTRAINT "Datensatz_Datenbank_Name_fkey" FOREIGN KEY ("Datenbank_Name") REFERENCES public."Datenbank" ("Name") NOT VALID;



ALTER TABLE ONLY public."Datensatz_Dienst"
    ADD CONSTRAINT "Datensatz_Dienst_DatensatzID_fkey" FOREIGN KEY ("DatensatzID") REFERENCES public."Datensatz" ("DatensatzID") NOT VALID;



ALTER TABLE ONLY public."Datensatz_Dienst"
    ADD CONSTRAINT "Datensatz_Dienst_DienstID_fkey" FOREIGN KEY ("DienstID") REFERENCES public."Dienst" ("MetadatenUUID");



ALTER TABLE ONLY public."Dienst_Anwendung"
    ADD CONSTRAINT "Dienst_Anwendung_AnwendungID_fkey" FOREIGN KEY ("AnwendungID") REFERENCES public."Anwendung" ("MetadatenUUID");



ALTER TABLE ONLY public."Dienst_Anwendung"
    ADD CONSTRAINT "Dienst_Anwendung_DienstID_fkey" FOREIGN KEY ("DienstID") REFERENCES public."Dienst" ("MetadatenUUID");



ALTER TABLE ONLY public."Dienst_Server"
    ADD CONSTRAINT "Dienst_Server_DienstID_fkey" FOREIGN KEY ("DienstID") REFERENCES public."Dienst" ("MetadatenUUID");



ALTER TABLE ONLY public."Dienst_Server"
    ADD CONSTRAINT "Dienst_Server_ServerID_fkey" FOREIGN KEY ("ServerID") REFERENCES public."Server" ("ServerID");



ALTER TABLE ONLY public."Server_Anwendung"
    ADD CONSTRAINT "Server_Anwendung_AnwendungID_fkey" FOREIGN KEY ("AnwendungID") REFERENCES public."Anwendung" ("MetadatenUUID");



ALTER TABLE ONLY public."Server_Anwendung"
    ADD CONSTRAINT "Server_Anwendung_ServerID_fkey" FOREIGN KEY ("ServerID") REFERENCES public."Server" ("ServerID");

