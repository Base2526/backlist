<?php
$client = new MongoDB\Client("mongodb://localhost:27017");

/*
https://docs.mongodb.com/php-library/v1.5/tutorial/crud/#insert-documents
# Get data

$db = (new MongoDB\Client("mongodb://mongo:27017"))->local;
$collection = $db->startup_log;
// dpm($collection);
$cursor = $collection->find();
   
// iterate cursor to display title of documents	
foreach ($cursor as $document) {
  echo $document["startTimeLocal"] . "\n";
}
*/

/*
# Insert data

$db = (new MongoDB\Client("mongodb://mongo:27017"))->huay;
$collection = $db->people;
$insertOneResult = $collection->insertOne([
    'username' => 'admin',
    'email' => 'admin@example.com',
    'name' => 'Admin User',
'name2' => 'Admin User222',
]);

printf("Inserted %d document(s)\n", $insertOneResult->getInsertedCount());

var_dump($insertOneResult->getInsertedId());
*/

/*
$db = (new MongoDB\Client("mongodb://mongo:27017"))->mongo_test;
$collection = $db->products;

$insertOneResult = $collection->insertOne([
    'name' => 'admin',
    'category' => 'admin@example.com',
    'price' => 'Admin User',
    'tags' => array("test1", "test2", "tag1"),
    'createdAt' => new MongoDB\BSON\UTCDateTime((new DateTime($today))->getTimestamp()*1000),
    'updatedAt' => new MongoDB\BSON\UTCDateTime((new DateTime($today))->getTimestamp()*1000),
]);

printf("Inserted %d document(s)\n", $insertOneResult->getInsertedCount());

var_dump($insertOneResult->getInsertedId());


*/

/**
 https://www.php.net/manual/en/mongo.connecting.rs.php
 ex.
 $db = (new MongoDB\Client("mongodb://mongo1:27017,mongo2:27017,mongo3:27017", array("replicaSet" => "rs0")))->local; 
*/
?>