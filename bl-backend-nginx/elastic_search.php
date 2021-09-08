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

?>