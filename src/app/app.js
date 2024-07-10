const express = require('express');
const fs = require('fs');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { Pool } = require('pg');
const cors = require("cors");
const {json, response} = require("express");
const {count} = require("rxjs");
const jwt = require('jsonwebtoken');
const {custom} = require("babel-loader");

const app = express() //creazione applicazione express.js
app.use(cors());
app.use(json());

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf8'));


// DBMS DEI DATI
const data_dbms = new Pool({
  user: 'dvd',
  host: 'localhost',
  database: 'dvdrental',
  password: 'dvd',
  port: 5432,
});

// DMBS CREDENZIALI UTENTE
const credentials_dbms = new Pool({
  user: 'dvd',
  host: 'localhost',
  database: 'dvdcredentials',
  password: 'dvd',
  port: 5432,
});

//Chiave di Tokenizzazione segreta al client
const key = "vStOktLoo9YLsi184_sLHanU64Azll0eV_UmRu3CXMSOriKPfZJGkc1e5Kj1xFkW"

//Opzioni sulla durata del token
const options = {
  expiresIn: "1h"
}

/**
 *
 * QUERY E MUTATION
 * films: fornisce i film al client
 * film_information: fornisce maggiori informazioni su un singolo film selezionato
 * film_store_information: fornisce le informazioni circa indirizzo e città di residenza di un preciso store
 * order_information: fornisce informazioni sugli ordini effettuati (pagati e non)
 * film_category_search: fornisce i film solo di una specifica categoria
 * film_title_search: fornisce i film solo di uno specifico titolo o una sua substringa
 * film_title_and_category_search: fornisce i film secondo i criteri incrociati delle precedenti due query
 * signUp: Registrazione utente
 * signIn: Autenticazione
 * rent: Effettua la prenotazione aggiungendo un rental alla propria tabella
 * token_test: Effettua un test completo sul token assegnato al client
 *
 * FUNZIONI
 * generate_token: funzione ausiliaria che genera il token sfruttando la libreria jsonwebtoken
 * verify_tokne: funzione ausiliaria che valuta i campi contenuti nel token sfruttando la libreria jsonwebtoken
 *
 */

const root = {
  // Prima query per le card
  films: async (args) => {

    const {offset = 0, limit = 12} = args;
    // Esegui la query nel database PostgreSQL per ottenere le informazioni sui film da mostrare nelle card

    //Controllo sui dati in input
    if(offset < 0 || offset == null || limit < 0 || limit == null)
      console.error("Bad offset or limit in query: films")

    const query_card = 'SELECT DISTINCT ON (f.title) title, f.description, f.release_year AS releaseyear, f.rating AS rating, f.length AS length, \n' +
      'c.name AS categoryname, l.name AS language, f.rental_rate AS rentalrate, f.rental_duration AS rentalduration\n'+
      'FROM film f\n' +
      'JOIN film_category fc ON f.film_id = fc.film_id\n' +
      'JOIN category c ON fc.category_id = c.category_id\n' +
      'JOIN language l ON f.language_id = l.language_id\n';

    const result_card = await data_dbms.query(query_card);

    //Controllo risultato query
    if(result_card == null)
      console.error("Bad query result in query: films")

    const films = result_card.rows.slice(args.offset, args.offset + args.limit);
    // Restituisci i dati trovati come risultato della query
    if (result_card.rows.length > 0) {
      return {
        count: result_card.rows.length,
        films: films.map(row => ({
          fulltext: row.fulltext,
          rating: row.rating,
          lastupdate: row.lastupdate,
          filmid: row.filmid,
          releaseyear: row.releaseyear,
          languageid: row.languageid,
          rentalduration: row.rentalduration,
          rentalrate: row.rentalrate,
          length: row.length,
          replacementcost: row.replacementcost,
          title: row.title,
          description: row.description,
          specialfeatures: row.specialfeatures,
          categoryname: row.categoryname,
          language: row.language
        }))
      };
    }
    // Se non sono presenti dati, restituisci un array vuoto
    return [];
  },

  film_information: async (args) => {

    const { title="" } = args;

    //Controllo sugli input
    if(title == null || title === "")
      console.error("Bad title in query: film_information")

    const query_infoFilm = 'SELECT DISTINCT ON(f.title) title, f.description, f.release_year AS releaseyear, ' +
      'f.rating AS rating, f.length AS length, c.name AS categoryname, l.name AS language, f.rental_rate AS rentalrate, ' +
      'f.rental_duration AS rentalduration, a.first_name AS actorfirstname, ' +
      'a.last_name AS actorlastname \n' +
      'FROM film f\n' +
      'JOIN film_category fc ON f.film_id = fc.film_id\n' +
      'JOIN category c ON fc.category_id = c.category_id\n' +
      'JOIN film_actor fa ON f.film_id = fa.film_id\n' +
      'JOIN actor a ON fa.actor_id = a.actor_id\n' +
      'JOIN language l ON f.language_id = l.language_id\n' +
      'WHERE $1 = f.title \n';

    const result_infoFilm = await data_dbms.query(query_infoFilm, [title]);

    //Controllo risultato query
    if(result_infoFilm == null)
      console.error("Bad query result in query: film_information")

    const film_information = result_infoFilm.rows.filter((ch) => ch.title === args.title);

    if (result_infoFilm.rows.length > 0) {
      return {
        film_information: film_information.map((row) => ({
          fulltext: row.fulltext,
          rating: row.rating,
          releaseyear: row.releaseyear,
          rentalduration: row.rentalduration,
          rentalrate: row.rentalrate,
          title: row.title,
          description: row.description,
          categoryname: row.categoryname,
          language: row.language,
          actorfirstname: row.actorfirstname,
          actorlastname: row.actorlastname,
          length: row.length
        })),
      };
    }
    // Se non sono presenti dati, restituisci un array vuoto
    return [];
  },

  film_store_information: async (args) => {

    const { title="" } = args;

    //Controllo sugli input
    if(title == null || title === "")
      console.error("Bad title in query: film_store_information")

    const query_storeInfo = 'SELECT DISTINCT ON (ct.city, add.address) ct.city AS city, add.address AS address, \n' +
      'add.phone AS phone, f.title, r.return_date\n' +
      'FROM film f\n' +
      'JOIN inventory i ON f.film_id = i.film_id\n' +
      'JOIN rental r ON i.inventory_id = r.inventory_id\n' +
      'JOIN store s ON i.store_id = s.store_id\n' +
      'JOIN address add ON s.address_id = add.address_id\n' +
      'JOIN city ct ON add.city_id = ct.city_id\n' +
      'WHERE f.title = $1 AND r.return_date IS NOT NULL \n' +
      'ORDER BY ct.city, add.address, f.film_id';

    const result_storeInfo = await data_dbms.query(query_storeInfo, [title]);

    //Controllo risultato query
    if(result_storeInfo == null)
      console.error("Bad query result in query: film_store_information")

    const film_store_information = result_storeInfo.rows.filter((ch) => ch.title === title);

    if (result_storeInfo.rows.length > 0) {
      return {
        film_store_information: film_store_information.map((row) => ({
          title: row.title,
          address: row.address,
          phone:row.phone,
          city : row.city
        })),
      };
    }
    // Se non sono presenti dati, restituisci un array vuoto
    return [];
  },

  order_information: async (args) => {

    const { token = "" } = args;

    const payload = jwt.verify(token,key)
    const customer_id = payload.id

    //Controllo sugli input
    if(customer_id < 0 || customer_id == null)
      console.error("Bad cutomer_id in query: order_information")

    const query_infoOrder = 'SELECT  DISTINCT ON(r.rental_id) r.rental_id, f.title, c.name AS categoryname,TO_CHAR(r.rental_date, \'YYYY-MM-DD \') AS rental_date,\n' +
      ' TO_CHAR(r.return_date, \'YYYY-MM-DD \') AS return_date,  p.amount,a.address,ci.city\n' +
      'FROM rental AS r\n' +
      'JOIN inventory AS i ON r.inventory_id = i.inventory_id\n' +
      'JOIN film AS f ON i.film_id = f.film_id\n' +
      'JOIN film_category fc ON f.film_id = fc.film_id\n' +
      'JOIN category c ON fc.category_id = c.category_id\n' +
      'JOIN customer cu ON r.customer_id = cu.customer_id\n' +
      'JOIN payment p ON cu.customer_id = p.customer_id\n' +
      'JOIN staff s ON s.staff_id = p.staff_id\n'+
      'JOIN store st ON st.store_id = s.store_id\n'+
      'JOIN address a ON a.address_id = st.address_id\n '+
      'JOIN city ci ON ci.city_id = a.city_id\n '+
      'WHERE $1 = r.customer_id \n';

    const result_order = await data_dbms.query(query_infoOrder, [customer_id]);

    //Controllo risultato query
    if(result_order == null)
      console.error("Bad query result in query: order_information")

    if (result_order.rows.length > 0) {
      return {
        order_information: result_order.rows.map((row) => ({
          rental_id: row.rental_id,
          title: row.title,
          categoryname: row.categoryname,
          rental_date: row.rental_date,
          return_date: row.return_date,
          amount: row.amount,
          address:row.address,
          city:row.city
        })),
      };
    }
    // Se non sono presenti dati, restituisci un array vuoto
    return [];
  },

  film_category_search: async (args) =>{

    const { categories = [], offset=0, limit=12 } = args;

    //Controllo sugli input
    if(categories.length === 0 || offset < 0 || limit < 0 || offset == null || limit == null)
      console.error("Bad input in query: film_category_search")

    const query_category_search = 'SELECT DISTINCT ON (f.title)  title, f.release_year AS releaseyear, f.rating AS rating,\n' +
      'c.name AS categoryname, l.name AS language, f.rental_rate AS rentalrate, f.rental_duration AS rentalduration\n' +
      'FROM film f\n' +
      'JOIN film_category fc ON f.film_id = fc.film_id\n' +
      'JOIN category c ON fc.category_id = c.category_id\n' +
      'JOIN language l ON f.language_id = l.language_id\n'+
      'WHERE c.name = ANY($1)';

    const result_category_search = await data_dbms.query(query_category_search, [categories]);

    //Controllo risultato query
    if(result_category_search == null)
      console.error("Bad query result in query: film_category_search")

    // Suddivido in offset
    const film_category_search = result_category_search.rows.slice(args.offset, args.offset + args.limit);

    if (result_category_search.rows.length > 0) {
      return {
        count: result_category_search.rows.length,
        film_category_search: film_category_search.map(row => ({
          fulltext: row.fulltext,
          rating: row.rating,
          lastupdate: row.lastupdate,
          filmid: row.filmid,
          releaseyear: row.releaseyear,
          languageid: row.languageid,
          rentalduration: row.rentalduration,
          rentalrate: row.rentalrate,
          length: row.length,
          replacementcost: row.replacementcost,
          title: row.title,
          description: row.description,
          specialfeatures: row.specialfeatures,
          categoryname: row.categoryname,
          language: row.language
        }))
      };
    }

    return [];
  },

  film_title_search: async (args) =>{

    // A differenza delle altre query in questo caso ho tre parametri
    const { title="",offset=0,limit=12 } = args;

    //Controllo sugli input
    if(title == null || title === "" || offset < 0 || offset == null || limit == null || limit < 0)
      console.error("Bad input in query: film_title_search")

    const query_title_search = 'SELECT DISTINCT ON (f.title) title, f.release_year AS releaseyear, f.rating AS rating,\n' +
      'c.name AS categoryname, l.name AS language, f.rental_rate AS rentalrate, f.rental_duration AS rentalduration\n' +
      'FROM film f\n' +
      'JOIN film_category fc ON f.film_id = fc.film_id\n' +
      'JOIN category c ON fc.category_id = c.category_id\n' +
      'JOIN language l ON f.language_id = l.language_id\n'+
      'WHERE LOWER(f.title) LIKE LOWER($1)';

    // LIKE consente una ricerca case-insensitive e consente anche corrispondenze parziali.

    const result_title_search = await data_dbms.query(query_title_search, [`%${title}%`]);

    //Controllo risultato query
    if(result_title_search == null)
      console.error("Bad query result in query: film_title_search")

    // Suddivido in offset
    const film_title_search = result_title_search.rows.slice(args.offset, args.offset + args.limit);

    if (result_title_search.rows.length > 0) {
      return {
        count: result_title_search.rows.length,
        film_title_search: film_title_search.map(row => ({
          fulltext: row.fulltext,
          rating: row.rating,
          lastupdate: row.lastupdate,
          filmid: row.filmid,
          releaseyear: row.releaseyear,
          languageid: row.languageid,
          rentalduration: row.rentalduration,
          rentalrate: row.rentalrate,
          length: row.length,
          replacementcost: row.replacementcost,
          title: row.title,
          description: row.description,
          specialfeatures: row.specialfeatures,
          categoryname: row.categoryname,
          language: row.language
        }))
      };
    }

    return [];
  },

  film_title_and_category_search: async (args) =>{

    // A differenza delle altre query in questo caso ho tre parametri
    const { title="",categories = [],offset=0,limit=12 } = args;

    //Controllo sugli input
    if(title == null || title === "" || offset < 0 || offset == null || limit == null || limit < 0 || categories.length === 0)
      console.error("Bad input in query: film_title_and_category_search")

    const query_title_and_category_search = 'SELECT DISTINCT ON (f.title) title, f.release_year AS releaseyear, f.rating AS rating,\n' +
      'c.name AS categoryname, l.name AS language, f.rental_rate AS rentalrate, f.rental_duration AS rentalduration\n' +
      'FROM film f\n' +
      'JOIN film_category fc ON f.film_id = fc.film_id\n' +
      'JOIN category c ON fc.category_id = c.category_id\n' +
      'JOIN language l ON f.language_id = l.language_id\n'+
      'WHERE c.name = ANY ($1)\n' +
      'AND LOWER(f.title) LIKE LOWER($2)';

    const result_title_and_category_search = await data_dbms.query(query_title_and_category_search, [categories, `%${title.toLowerCase()}%`]);

    //Controllo risultato query
    if(result_title_and_category_search == null)
      console.error("Bad query result in query: film_title_and_category_search")

    // Suddivido in offset
    const film_title_and_category_search = result_title_and_category_search.rows.slice(args.offset, args.offset + args.limit);

    if (result_title_and_category_search.rows.length > 0) {
      return {
        count: result_title_and_category_search.rows.length,
        film_title_and_category_search: film_title_and_category_search.map(row => ({
          fulltext: row.fulltext,
          rating: row.rating,
          lastupdate: row.lastupdate,
          filmid: row.filmid,
          releaseyear: row.releaseyear,
          languageid: row.languageid,
          rentalduration: row.rentalduration,
          rentalrate: row.rentalrate,
          length: row.length,
          replacementcost: row.replacementcost,
          title: row.title,
          description: row.description,
          specialfeatures: row.specialfeatures,
          categoryname: row.categoryname,
          language: row.language
        }))
      };
    }

    return [];
  },

  //QUERY DI REGISTRAZIONE
  signUp:async (args)=>{

    const { username, password } = args;

    //Controllo sugli input
    if(username === "" || username == null || password === "" || password == null)
      console.error("Bad input in query: signUp")

    // Non diventa verde causa niente capo riga
    const query_signUp = 'INSERT INTO user_credentials (username, password) VALUES ($1, $2);'

    try {
      await credentials_dbms.query(query_signUp, [username, password]);
    } catch (err) {
      console.error('Errore durante la registrazione:', err);
    }
  },

  // QUERY DI VERIFICA AUTENTICAZIONE
  signIn: async (args)=>{

    const {username="",password=""} = args;

    //Controllo sugli input
    if(username === "" || username == null || password === "" || password == null)
      console.error("Bad input in query: signIn")

    const query_signIn = 'SELECT u.username,u.password, u.customer_id FROM user_credentials u WHERE u.username = $1 AND u.password = $2';
    const result_signIn = await credentials_dbms.query(query_signIn, [username,password]);

    //Controllo risultato query
    if(result_signIn == null)
      console.error("Bad query result in query: signIn")

    // Generazione del token

    const token = generateToken(username,result_signIn.rows[0].customer_id)

    // Salvo il token per effettuare le verifiche
    const save_token = 'UPDATE user_credentials SET user_token = $1 WHERE username = $2 AND password = $3 ';

    try{
      await credentials_dbms.query(save_token, [token,username,password]);
    }
    catch (err){
      console.error(err)
    }


    if (result_signIn.rows.length === 1) {
      return {
        isAuthenticated: true,
        customer_id: result_signIn.rows[0].customer_id,
        token:token,
        expiresIn:options.expiresIn
      };
    }

    return {
      isAuthenticated: false,
      token:null,
      expiresIn:null
    };
  },

  //QUERY DI PRENOTAZIONE
  rent:async (args)=>{

    const { token="",city="",address="",starting_rental=new Date(),end_rental=new Date(),film_title=""} = args;

    const payload = jwt.verify(token,key)
    const customer_id = payload.id

    //Controllo sugli input
    if(customer_id < 0 || customer_id == null || city ==="" || city == null || address === "" || address == null || starting_rental == null || end_rental == null || film_title === "" || film_title == null)
      console.error("Bad input in query: rent")

    const query_inventory_id = 'SELECT i.inventory_id \n' +
      'FROM inventory i \n' +
      'JOIN film f ON f.film_id = i.film_id \n' +
      'JOIN rental r ON i.inventory_id = r.inventory_id JOIN store s ON s.store_id = i.store_id \n' +
      'JOIN address a ON a.address_id = s.address_id JOIN city ci ON a.city_id = ci.city_id WHERE f.title = $1 \n' +
      'AND return_date IS NOT NULL AND a.address = $2 AND ci.city = $3 LIMIT 1'
    result_inventory_id = await data_dbms.query(query_inventory_id,[film_title, address,city])

    //Controllo risultato query
    if(result_inventory_id == null)
      console.error("Bad query result in query: rent")

    const query_staff_id = 'SELECT st.staff_id FROM staff st JOIN store s ON st.store_id = s.store_id JOIN address a ON a.address_Id = s.address_id WHERE a.address = $1'
    result_staff_id =  await data_dbms.query(query_staff_id,[address])

    //Controllo risultato query
    if(result_staff_id == null)
      console.error("Bad query result in query: rent")

    const inventory_id = result_inventory_id.rows[0].inventory_id
    const staff_id = result_staff_id.rows[0].staff_id

    const query_rentalID = 'SELECT DISTINCT ON (ct.city, add.address) ct.city AS city, add.address AS address, \n' +
      'f.title, r.rental_id\n' +
      'FROM film f\n' +
      'JOIN inventory i ON f.film_id = i.film_id\n' +
      'JOIN rental r ON i.inventory_id = r.inventory_id\n' +
      'JOIN store s ON i.store_id = s.store_id\n' +
      'JOIN address add ON s.address_id = add.address_id\n' +
      'JOIN city ct ON add.city_id = ct.city_id\n' +
      'WHERE f.title = $1 AND r.return_date IS NOT NULL\n';

    const result_rentalID = await data_dbms.query(query_rentalID, [film_title])

    const rental_id = result_rentalID.rows[0].rental_id

    /*SELECT ct.city AS city, add.address AS address,
      f.title, r.rental_id, r.return_date, r.rental_date, i.inventory_id
      FROM film f
      JOIN inventory i ON f.film_id = i.film_id
      JOIN rental r ON i.inventory_id = r.inventory_id
      JOIN store s ON i.store_id = s.store_id
      JOIN address add ON s.address_id = add.address_id
      JOIN city ct ON add.city_id = ct.city_id
      WHERE f.title = 'Connection Microcosmos'*/


    const query_rent = 'UPDATE rental \n' +
      'SET rental_date = $1, return_date = $2, customer_id = $3 ,inventory_id = $4, staff_id = $5 \n' +
      'FROM customer AS c, inventory AS i\n' +
      'WHERE rental_id = $6\n';

    //TODO dobbiamo dire all'utente che vuole prendere lo stesso film nello stesso inventory per la stessa data e sta cosa un se po fa, che sigurda lo stesso film con 2 DVD diversi lo stesso giorno?
    try {
      const result = await data_dbms.query(query_rent, [starting_rental, null, customer_id, inventory_id, staff_id, rental_id]);
    } catch (err) {
      console.error('Errore durante la prenotazione:', err);
    }

    //TODO ho notato che questa cosa ormai non serve più perchè noi controlliamo direttamente se return_date è null allora settiamo amount a pending!!!
    const query_amount = "UPDATE payment \n" +
      "SET customer_id = $1, staff_id = $2, rental_id=$3, amount=$4, payment_date=$5 \n" +
      "WHERE rental_id = $6"

    try{
      await data_dbms.query(query_amount,[customer_id, staff_id, rental_id, 0.0, new Date(), rental_id])
    } catch (err){
      console.error(err)
    }


  },

  tokenTest: async (args)=> {

    const {token ="",username="",password=""} = args;

    //Controllo sugli input
    if(token === "" || token == null || username === "" || username == null || password === "" || password == null)
      console.error("Bad input in query: tokenTest\n user "+username+" isLoggedOut")

    // Verifica dell'intero token
    const query_test = 'SELECT u.user_token,u.customer_id FROM user_credentials u WHERE u.username = $1 AND u.password = $2 AND u.user_token = $3';
    const result_test = await credentials_dbms.query(query_test, [username, password,token]);

    //Controllo risultato query
    if(result_test == null)
      console.error("Bad query result in query: tokenTest")

    if (result_test.rows.length === 1 && token_verify(token,result_test.rows[0].customer_id,username)) {
      return {
        result : true
      };
    }

    return {
      result : false
    };


  },

  // Query di controllo di nome utente già selezionato
  double_user: async (args)=> {

    const {username=""} = args;

    //Controllo sugli input
    if(username == null || username ==="")
      console.error("Bad input in query: double_user")

    // Verifica dell'intero token
    const query_double_user = 'SELECT u.username FROM user_credentials u WHERE u.username = $1';
    const result_double_user = await credentials_dbms.query(query_double_user, [username]);

    //Controllo risultato query
    if(result_double_user == null)
      console.error("Bad query result in query: tokenTest")

    // Ritorna true se ho utenti doppi alla registrazione
    if (result_double_user.rows.length >= 1) {
      return {
        result : true
      };
    }

    return {
      result : false
    };


  },

  same_date_check: async (args)=> {


    const {title="", start_date= new Date(),token=""} = args;

    const payload= jwt.verify(token,key)
    const customer_id = payload.id




    // Verifica dell'intero token
    const query_date_check =
      'SELECT ct.city AS city, add.address AS address,\n' +
      '      f.title, r.rental_id, r.return_date, r.rental_date, i.inventory_id\n' +
      '      FROM inventory i\n' +
      '      JOIN film f ON  i.film_id = f.film_id\n' +
      '      JOIN rental r ON i.inventory_id = r.inventory_id\n' +
      '      JOIN store s ON i.store_id = s.store_id\n' +
      '      JOIN address add ON s.address_id = add.address_id\n' +
      '      JOIN city ct ON add.city_id = ct.city_id\n' +
      '      JOIN customer c ON c.customer_id = r.customer_id\n'+
      '      WHERE f.title = $1 AND r.return_date IS NULL AND r.rental_date = $2 AND c.customer_id = $3';

    const result_date_check = await data_dbms.query(query_date_check, [title, start_date,customer_id]);

    //Controllo risultato query
    if(result_date_check == null)
      console.error("Bad query result in query: same date check")

    // Ritorna true se ho utenti doppi alla registrazione
    if (result_date_check.rows.length >= 1) {
      return {
        result : true
      };
    }
    return {
      result : false
    };
  },

}

// Configurazione di GraphQL, è usato il middleware graphqlHTTP (è una funzione che viene eseguita tra la ricezione
// di una richiesta HTTP e la gestione della risposta)
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

// avvio del server sulla porta 3000
app.listen(3000, () => {
  console.log('backend listening on port 3000');
});

function generateToken(username,customer_id){

  let token = ""

  const payload = {
    sub:username,
    id:customer_id
  }

  try{
    token = jwt.sign(payload,key,options)
  }
  catch (error){
    console.error(error)
  }


  return token
}

function token_verify(token,customer_id,username){

  const decoded = jwt.verify(token,key)
  return customer_id === decoded.id && username === decoded.sub
}

