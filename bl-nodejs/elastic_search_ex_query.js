/*
WHERE status = true
*/
const { body } = await client.search({
                                        index: 'elasticsearch_index_banlist_content_back_list',
                                        body:  {
                                        "query": {
                                            "bool": {
                                                "filter": [
                                                    { "term": { "status": true }}
                                                ]
                                            }
                                        },
                                        size: 5,
                                        }
                                    })


/*
WHERE uid = 61 AND status = true
*/
const { body } = await client.search({
                                        index: 'elasticsearch_index_banlist_content_back_list',
                                        body:  {
                                        "query": {
                                            "bool": {
                                                "must": [
                                                    {"match" : { "uid": 61 }},
                                                    {"match" : { "status": true}},
                                                ],
                                            }
                                        },
                                        size: 5,
                                        }
                                    })

/*
 WHERE status != false AND title = *ประ*
*/
const { body } = await client.search({
                                        index: 'elasticsearch_index_banlist_content_back_list',
                                        body:  {
                                        "query": {
                                            "bool": {
                                                "must_not": [
                                                  {"match": { "status": false}}
                                                ],
                                                "should": [
                                                  { "wildcard" : { "title" : "*ประ*" }},
                                                ]
                                            }
                                        },
                                        size: 5,
                                        }
                                    })

/*
Multi wildcard
*/
const { body } = await client.search({
                                        index: 'elasticsearch_index_banlist_content_back_list',
                                        body:  {
                                        "query": {
                                            "bool": {
                                                must_not: [
                                                    {match: { status : false}}
                                                ],
                                                should: [
                                                    { wildcard : { title : "*ประ*" }},
                                                    { wildcard : { body : "*ประ*" }},
                                                ]
                                            }
                                        },
                                        size: 5,
                                        }
                                    })
