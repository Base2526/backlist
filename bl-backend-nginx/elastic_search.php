<?php

// https://github.com/elastic/elasticsearch-php

use Elasticsearch\ClientBuilder;

$hosts = [
    [
        'host' => 'elasticsearch.banlist.info',
        'port' => '9200',
        'user' => 'elastic',
        'pass' => 'changeme'
    ]
];

$client = ClientBuilder::create()
                    ->setHosts($hosts)
                    ->build();

// $client = ClientBuilder::create()->build();


$params = [
    'index' => 'banlist',
    'id'    => '6134c9f0d9567f0d8b13c7d8:68:225:back_list:en'
];

$response = $client->get($params);
if(empty($response)){
  dpm("YES");
}




//////////// test ///////////////


use Drupal\backlist\Utils\Utils;
$client = Utils::Elastic_Connect();

// dpm( $client );
/*
$params = [
    'index' => 'banlist_dev',
    'id'    => '6134ca69d9567f0d8b13c7ea:1:231:back_list:en'
];

try{
$response = $client->get($params);
print_r($response);
}catch (Throwable $t){
  dpm( 'error');
}
*/


$params = [
    'index' => 'banlist_dev',
    'body'  => [
        'query' => [
            'bool' => [
                'must' => [
                    ["match" => [ "nid"=> 231 ]],
                ]
            ]
        ]
    ]
];

$response = $client->search($params);

if($response["hits"]["total"]["value"] > 0){
  // dpm( $response["hits"]["hits"] );
  foreach( $response["hits"]["hits"] as $hit ){
    dpm($hit["_id"]);

    $params = [
       'index' => 'banlist_dev',
       'id'    =>  $hit["_id"],
       'body'  => [
         'doc' => [
            'app_followers'=>[]
          ]
         ]
       ];


    $response = $client->update($params);
  }
}



?>