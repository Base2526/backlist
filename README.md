Backup, restore postgres in docker container
https://gist.github.com/gilyes/525cc0f471aafae18c3857c27519fc4b
Backup:
docker exec -t -u postgres your-db-container pg_dumpall -c > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

docker exec -t -u postgres 49b9509f7e98 pg_dumpall -c > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql


Restore:
cat backlist_21122020_2106.sql | docker exec -i 17f16008f1ac psql -Upostgres


Facebook Login
 - https://www.thaicreate.com/community/php-facebook-login-api-sdk-v5.html
 - https://github.com/facebook/react-native-fbsdk
 - https://medium.com/@mehrankhandev/integrating-fbsdk-facebook-login-in-react-native-7b7600ce74a7
 
Google Login
 - https://github.com/react-native-google-signin/google-signin

Theme
https://www.drupal.org/docs/8/themes/barrio-bootstrap-4-drupal-89-theme/bootstrap-barrio-installation/installation
https://www.youtube.com/watch?v=59QBCzaH6JI&feature=youtu.be

Theme bootstrap_barrio status_messages
https://www.drupal.org/project/bootstrap_barrio/issues/3037643

https://gist.github.com/bdlangton/e826276a0c78d9a89d8dec23dd0c7683

Secure Apache with Let's Encrypt on Debian 10
https://linuxize.com/post/secure-apache-with-let-s-encrypt-on-debian-10/


Google OAuth client created
- Your Client ID
693724870615-2hkmknke3sj6puo9c88nk67ouuu9m8l1.apps.googleusercontent.com
- Your Client Secret
zaqrtYlJrf-1215zE42xBBIe


- docker mmap() failed: [12] Cannot allocate memory
Composer require runs out of memory. PHP Fatal error: Allowed memory size of xxxxx bytes exhausted
https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-centos-7

Login with Google
https://console.developers.google.com/apis/credentials?project=banlist-info&folder=&organizationId=
React-native : https://chaim-zalmy-muskal.medium.com/hi-6d328bbd550f


Drapal 8-9 : Advanced Queue
https://ericpugh.dev/2020/drupal-advanced-queue-tutorial/


Excel
- composer phpoffice/phpspreadsheet
- Read multi images
  https://programming.vip/docs/php-reading-pictures-in-excel.html

- Read row & image
  https://github.com/rajaramtt/phpspreadsheet-Reading-Images-from-an-Excel-File

Twitter
 - https://twitteroauth.com/
 - https://processwire.com/talk/topic/21667-how-to-post-tweets-to-twitter-api-with-twitteroauth/


Memcaching redis
 https://chromatichq.com/blog/configuring-redis-caching-drupal-8


Count  > https://www.drupal.org/docs/8/api/database-api/dynamic-queries/count-queries
$time1    = microtime(true); 
$storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $storage->getQuery();
    $query->condition('status', \Drupal\node\NodeInterface::PUBLISHED);
    $query->condition('type', 'back_list');
     
    $and = $query->andConditionGroup();
            $and->condition('field_sales_person_name', $name, '=');
            $and->condition('field_sales_person_surname', $surname, '=');
        $query->condition($and);
$num_rows = $query->count()->execute();
dpm($num_rows);

$execution_time   = microtime(true) - $time1;

dpm( $execution_time  );


//////// delete by content type ///////////
  $query = \Drupal::entityQuery('node')
    ->condition('type', 'back_list');
  $nids = $query->execute();
  // dpm($nids);
  foreach ($nids as $nid) {
    \Drupal\node\Entity\Node::load($nid)->delete();
  }

//////// delete by content type ///////////


/// reset node start node = 1
UPDATE node SET nid = DEFAULT;
UPDATE node_revision SET nid = DEFAULT;
UPDATE node_field_data SET nid = DEFAULT;
UPDATE node_field_revision SET nid = DEFAULT;


/*
* hook_ENTITY_TYPE_update()
*/
// Case update config_pages > 
function bigcard_config_pages_update(Drupal\Core\Entity\EntityInterface $entity) {
  // $entity->getEntityTypeId() is value config_pages
  // dpm( $entity->getEntityTypeId() );
  // Clear && Rebuild cache from config_page update data.
  \Drupal::logger('bigcard_config_pages_update')->debug( "bigcard_config_pages_update" );
}


Postgre change performance
- https://www.enterprisedb.com/postgres-tutorials/how-tune-postgresql-memory
- https://github.com/docker-library/docs/tree/master/postgres

- ดูค่าที่เราปรับเปรียน
  SHOW shared_buffers;
  
  
  
Axois upload multi
- https://tuanitpro.com/how-to-upload-multiple-files-react-native/

Loading React-Native
 - https://www.npmjs.com/package/react-native-loading-spinner-overlay
 
Lazy Image React-Native 
 - https://www.npmjs.com/package/react-lazy-load-image-component
 
Elasticsearch Drupal 8-9
 - https://www.lullabot.com/articles/indexing-content-from-drupal-8-to-elasticsearch
 - https://medium.com/@ashutoshsngh67/intergration-of-elasticsearch-with-drupal-8-26d2ed56a47c
 - https://www.drupal.org/docs/8/modules/search-api/developer-documentation/executing-a-search-in-code
 - https://discuss.elastic.co/t/unable-to-set-password-for-elastic-7-1-1/186160/3

Redux
 - https://code.tutsplus.com/tutorials/using-redux-in-a-react-native-app--cms-36001




Drupal 8-9 add button form 
/**
 * Implement hook_form_alter()
 * add js to form
 * 
 * https://www.drupal.org/forum/support/module-development-and-code-questions/2019-03-26/hook_form_alter-custom-submit-handler
 * 
*/
// array &$form, FormStateInterface $form_state
function bigcard_form_alter(&$form, FormStateInterface $form_state, $form_id) {
  switch($form_id){
    case 'node_article_edit_form':{
      // unset($form['meta']);


      // #title
      // dpm($form);

      // $form['#title'] = 'test - 999';

      $form['title']['widget'][0]['value']['#prefix'] = '<div><b>1->2->3->4</b>';
      $form['title']['widget'][0]['value']['#suffix'] = '</div>';
      $form['title']['widget'][0]['value']['#title'] = 'First Name';
      $form['title']['widget'][0]['value']['#value'] = '66666666666';

      // $form['body'] = 'First Name';

      $form['body']['widget'][0]['#title'] = 'Body > title';
      $form['body']['widget'][0]['#value'] = 'Body > body';
      // dpm(  $form['body']['widget'][0]['#title'] );
      // $form['body']['widget'][0]['value']['#title'] = '555';

      // $build['field_transfer_amount'][0]['#prefix'] = '<div><b>'.t('สินค้า/ประเภท') . '</b>';
      // $build['field_transfer_amount'][0]['#suffix'] = '</div>';

      //  $form['#submit'][] = 'genpass_user_admin_settings_submit';

      // dpm(  $form['actions'] );

      $form['actions']['submit']['#value'] = t('Register Now!');

      // $form['actions']['submit']['#submit'][] = 'my_module_node_article_form_submit';

      // $form['submit']['#submit'][] = 'my_module_node_article_form_submit';

      // array_unshift ($form['#submit'],'my_module_node_article_form_submit');

      // dpm($form);
      unset( $form['actions']['submit'] );
      unset( $form['actions']['preview'] );
      unset( $form['actions']['delete'] );

      // preview, delete

      $form['actions']['submit']['login'] = array(
        '#type' => 'submit',
        '#name' => 'login',
        '#value' => 'Login 1',
        '#prefix'   => '',
        '#suffix'   => '',
        '#submit' => ['submitAjax'],
        '#ajax' => [
          'callback' => 'callbackAjax',
          // 'wrapper' => 'user-login-form',
          'progress' => array(
              // Graphic shown to indicate ajax. Options: 'throbber' (default), 'bar'.
              'type' => 'fullscreen',
              // Message to show along progress graphic. Default: 'Please wait...'.
              'message' => NULL,
          ),
        ],
        '#weight'=> 10000
      );


      $form['actions']['submit']['login1'] = array(
        '#type' => 'submit',
        '#name' => 'login',
        '#value' => 'Login 2',
        '#prefix'   => '',
        '#suffix'   => '',
        '#submit' => ['submitAjax'],
        '#ajax' => [
          'callback' => 'callbackAjax',
          // 'wrapper' => 'user-login-form',
          'progress' => array(
              // Graphic shown to indicate ajax. Options: 'throbber' (default), 'bar'.
              'type' => 'fullscreen',
              // Message to show along progress graphic. Default: 'Please wait...'.
              'message' => NULL,
          ),
        ],
        '#weight'=> 10001
      );


      $form['actions']['submit']['login2'] = array(
        '#type' => 'submit',
        '#name' => 'login',
        '#value' => 'Login 3',
        '#prefix'   => '',
        '#suffix'   => '',
        '#submit' => ['submitAjax'],
        '#ajax' => [
          'callback' => 'callbackAjax',
          // 'wrapper' => 'user-login-form',
          'progress' => array(
              // Graphic shown to indicate ajax. Options: 'throbber' (default), 'bar'.
              'type' => 'fullscreen',
              // Message to show along progress graphic. Default: 'Please wait...'.
              'message' => NULL,
          ),
        ],
        '#weight'=> 10002
      );

      // $form = array_merge($form, $fL);

      break;
    }

    default:{

      break;
    }

  }
}

function my_module_node_article_form_submit($form, FormStateInterface $form_state) {
  dpm('Running custom submit handler...');
}

function submitAjax(array &$form, FormStateInterface $form_state) {
  // drupal_set_message("s1confirm_form_submit.");

  // dpm($form_state);

  dpm('submitAjax');

}

function callbackAjax(array &$form, FormStateInterface $form_state) {

  dpm('callbackAjax');

  $ajax_response = new AjaxResponse();
  return $ajax_response;
}
Drupal 8-9 add button form 


****** Elasticsearch ********
 - เราต้องนำ vendor ออกมาเพือลง composer require drupal/elasticsearch_connector ก่อนถ้าลงใน docker จะไม่สามารถลงได้ แล้วค่อย import vendor เข้าไปใน docker
Drupal 8-9 Search api
- https://drupal.stackexchange.com/questions/225008/programatically-use-search-api
- https://www.hook42.com/blog/search-and-facets-and-queries-oh-my
- https://www.drupal.org/project/elasticsearch_connector/issues/2782745

-  cluster >> https://marcofranssen.nl/building-a-elasticsearch-cluster-using-docker-compose-and-traefik/


React native animation
- https://itnext.io/change-react-native-screen-animation-direction-with-react-navigation-8cec0f66f22


/////////////////
use Drupal\search_api\Entity\Index; 

$index = Index::load('content_back_list');
        $query = $index->query();


        // Change the parse mode for the search.
        $parse_mode = \Drupal::service('plugin.manager.search_api.parse_mode')->createInstance('direct');
        $parse_mode->setConjunction('OR');
        $query->setParseMode($parse_mode);

        $query->addCondition('type', 'back_list');

        // Set fulltext search keywords and fields.
        //$query->keys('เค้า');
        //$query->setFulltextFields([ 'body']);

        $query->keys('ไอ');
        $query->setFulltextFields(['title', 'name', 'body', 'field_sales_person_name']);

        $results = $query->execute();

        $count = count($results->getResultItems());
        echo "Result count: { $count }\n";

        $data = array();
        foreach ($results as $result) {
           $nid    = $result->getField('nid')->getValues();
           $title  = $result->getField('title')->getValues();
           $name = $result->getField('field_sales_person_name')->getValues();
           $body   = $result->getField('body')->getValues();

           // $data[] = array($nid, $title, $name, $body);

           // dpm( $title[0]->getText());

$result_transfer_amount = $result->getField('field_transfer_amount')->getValues();  

           // dpm($result_transfer_amount);

           $result_title  = $result->getField('title')->getValues();

           dpm( $result_title[0] );
        }


dpm($data);

 ////////////////
 
 
 
 Animate card
 https://github.com/jacklam718/react-native-modals


 Delete file on git server
 https://stackoverflow.com/questions/38983153/git-ignore-env-files-not-working



 React native  Layout image
 https://stackoverflow.com/questions/61528156/trying-to-merge-4-table-cell-of-33-image-grid-in-react-native


---- Search api ----
https://medium.com/@easternstandard/how-to-configure-drupal-8-text-search-to-return-better-more-intuitive-search-results-fe0a78136ad7

https://gist.github.com/WengerK/9523cb4ce9f7e6c220ce0b20773a3ce8

---- Search api ----


Node kill post : 3000
ps -ef | grep node
# or 
ps aux | grep node

kill -9 PROCESS_ID 



///////////////////////////////////////////////////////

Creating custom Text Selection actions with ACTION_PROCESS_TEXT
https://medium.com/androiddevelopers/custom-text-selection-actions-with-action-process-text-191f792d2999#.h6377bc8j

https://dev.to/bigaru/providing-custom-text-selection-actions-in-android-1akc

China language
https://www.programmersought.com/article/9272124547/

https://github.com/jicanghai37927/WhatsAndroid

https://mobikul.com/passing-information-from-java-to-javascript-in-react-native/

///////////////////////////////////////////////////////


/// React-native optimized 
https://stackoverflow.com/questions/61043847/react-native-bad-app-performance-after-loading-images

/// React-native Flatlists -- Performance settings
https://stackoverflow.com/questions/55032060/react-native-lazy-loading-250-images-in-a-scroll-view


/// React-native > Android app memory
https://shift.infinite.red/react-native-android-app-memory-investigation-55695625da9c


Perferment react-native clear memory
https://dev.to/otamnitram/react-useeffect-cleanup-how-and-when-to-use-it-2hbm









fetch Data

use Drupal\search_api\Entity\Index;

$index = Index::load('content_back_list');
$query = $index->query();

// Change the parse mode for the search.
$parse_mode = \Drupal::service('plugin.manager.search_api.parse_mode')->createInstance('direct');
$parse_mode->setConjunction('OR');
$query->setParseMode($parse_mode);

$query->addCondition('type', 'back_list');
// $query->addCondition('nid', 70260, '<');
$query->sort('nid', 'DESC');

$query->range(2,2);

// $query->sort('field1', 'DESC');
// $query->sort('field2', 'ASC');

 // Execute the search.
 $results = $query->execute();

// dpm( count($results) );

$count = count($results->getResultItems());

 // dpm( $count );

foreach ($results as $result) {
   $result_nid    = $result->getField('nid')->getValues();
   dpm(  $result_nid );
}






/// REACT_HOOK ///
https://dev.to/ltsharma/performance-optimisation-react-native-with-hooks-a77