<?php

namespace Drupal\backlist\Breadcrumb;

use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Link;
use Drupal\Core\Url;

use Drupal\node\Entity\Node;

/*
https://glassdimly.com/blog/tech/drupal-8-theming-views-planet-drupal/drupal-83-create-programmatic-custom-breadrumb
https://drupal.stackexchange.com/questions/151133/how-do-you-implement-a-breadcrumb

with parameter
Link::fromTextAndUrl(t('แก้ไข Approval Code'), Url::fromRoute('printing.form', array('nid' => $nid)));
*/
class BreadcrumbBuilder implements BreadcrumbBuilderInterface {
    /**
     * @inheritdoc
     */
    public function applies(RouteMatchInterface $route_match) {
        /* Allways use this. Change this is another module needs to use a new custom breadcrumb */

        // dpm( ">> |" . $route_match->getRouteName() . "| <<");
        switch($route_match->getRouteName()){
            case 'node.add':
            case 'frontpage':
            case 'entity.node.canonical':
            case 'entity.node.edit_form':
            case 'user.login':
            case 'user.pass':
            case 'user.register':
            case 'profile.form':
            case 'forum.index':
            case 'report_view.form':
            case 'filter_by_person.form':
            case 'entity.user.canonical':
            
            // case 'new_member.step4':
            // case 'what_is_bigcard.form': 
            // case 'exclusive.form':
            // case 'terms_and_conditions.form':
            // case 'dining.form':
            // case 'hotel_travel.form':
            // case 'health_beauty.form':
            // case 'edutainment.form':
            // case 'lifestyle.form':
            // case 'step_check_point.form':
            // case 'how_to_register_bigcard.form':
            // case 'contact_us.form': 
            // case 'question_and_answer.form':
            // case 'collect_points.form':
            // case 'discount_point.form':
            // case 'pointfree.form': 
            // case 'search.form':
            // case 'sp.form':
            // case 'promotion_detail.form':
            // case 'special_sticker.form':
            // case 'step_to_join.form':
            // case 'sp_detail.form':
            // case 'forgotpassword.form':
            // case 'register.form':
            // case 'create_shortlink.form': 
            // case 'preview_shortlink.form':
            // case 'extra_menu.form': 
            // case 'view.content.page_2':
            // case 'view.content.page_3':
            {
                return true;
            }
            default:{
                return false;
            }
        }
        

        return false;
    }

    /**
     * @inheritdoc
     */
    public function build(RouteMatchInterface $route_match) {
        $breadcrumb = new Breadcrumb();
        $breadcrumb->addCacheContexts(['url.path']);
    
        // Home Member New Member
        switch($route_match->getRouteName()){
            case 'node.add':{
                $route_match = \Drupal::service('current_route_match');
                $node_type = $route_match->getParameter('node_type');

                switch($node_type->id()){
                    case 'back_list':{
                        $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Create Ban list'), '<none>'),]);
                    break;
                    }
                }
                break;
            }
            
            case 'frontpage':{
                // dpm('Breadcrumb : frontpage');
                break;
            }

            case 'entity.node.canonical':{
                $node         = $route_match->getParameter('node');
                $content_type = $node->bundle();

                if(strcmp($content_type, 'back_list') == 0){
                    // $from = \Drupal::service('current_route_match')->getParameter('from');
                    // dpm( $from );
                    // $from = explode("&", urldecode( $from ));
                    // $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                    //                         Link::fromTextAndUrl(t('Search results'), Url::fromRoute('filter_by_person.form', array('name' => $from[0], 'surname' => $from[1] ))),
                    //                         Link::createFromRoute(t($node->label()), '<none>'),
                    //                         ]);

                    $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                            Link::createFromRoute(t($node->label()), '<none>'),]);

                    // kint( \Drupal::service('current_route_match')->getParameter('from') );
                }else if(strcmp($content_type, 'article') == 0){
                    switch($node->id()){
                        case 2:{
                            $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                                    Link::createFromRoute(t('Terms of service'), '<none>'),]);
                        break;
                        }
    
                        case 3:{
                            $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                                    Link::createFromRoute(t('About us'), '<none>'),]);
                        break;
                        }
                    }
                }
                
                break;
            }

            case 'entity.node.edit_form':{
                $node   = $route_match->getParameter('node');
                $content_type = $node->bundle();
                if(strcmp($content_type, 'back_list') == 0){
                    $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                            Link::fromTextAndUrl(t('My Profile'), Url::fromRoute('profile.form', array('uid' => \Drupal::currentUser()->id() ))),
                                            Link::createFromRoute(t('Edit') .' '. t($node->label()), '<none>'),]);

                    break;
                }
            }

            case 'user.login':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Login'), '<none>'),]);
                break;
            }

            case 'user.pass':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Login'), 'user.login'),
                                        Link::createFromRoute(t('Forgot password'), '<none>'),]);
                break;
            }
                
            case 'user.register':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Login'), 'user.login'),
                                        Link::createFromRoute(t('Register'), '<none>'),]);
                break;
            }

            case 'profile.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Profile'), '<none>'),]);
                break;
            }

            case 'forum.index':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Forums'), '<none>'),]);
                break;
            }

            case 'report_view.form':{
                $nid = $route_match->getParameter('nid');
                $from = $route_match->getParameter('from');

                // dpm($from);

                $node = Node::load($nid);
                if($from == 'frontpage'){
                    if(!empty($node)){
                        $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                                Link::createFromRoute(t($node->label()), '<none>'),]);
                    }
                }else{

                    $from = explode("&", urldecode( $from ));
                    $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                            Link::fromTextAndUrl(t('Search results'), Url::fromRoute('filter_by_person.form', array('name' => $from[0], 'surname' => $from[1] ))),
                                            Link::createFromRoute(t($node->label()), '<none>'),
                                            ]);
                }
               

                break;
            }

            case 'filter_by_person.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Search results'), '<none>'),]);
                break;
            }

            case 'entity.user.canonical':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Profile'), '<none>'),]);
                break;
            }
            
            /*
            case 'new_member.step3':
            case 'new_member.step4': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Member'), '<none>'),
                                        Link::createFromRoute(t('New Member'), '<none>'),]);
                break;
            }
            case 'what_is_bigcard.form': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('What is BigCard?'), '<none>'),]);
                break;
            }

            case 'exclusive.form': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Special previleges from BigCard'), '<none>'),]);
                break;
            }

            case 'terms_and_conditions.form': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('Terms And Conditions'), '<none>'),]);
                break;
            }

            case 'dining.form': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('Food & Beverages'), '<none>'),]);
                break;
            }

            case 'hotel_travel.form': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('Hotels & Travel'), '<none>'),]);
                break;
            }

            case 'health_beauty.form': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('Health & Beauty'), '<none>'),]);
                break;
            } 

            case 'edutainment.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('Education'), '<none>'),]);
                break;
            } 

            case 'lifestyle.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('Lifestyles'), '<none>'),]);
                break;
            } 

            case 'step_check_point.form': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('ตรวจสอบคะแนนได้ที่'), '<none>'),]);
                break;
            }

            case 'how_to_register_bigcard.form': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('First login'), '<none>'),]);
                break;
            }

            case 'contact_us.form': {
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('Contact Us'), '<none>'),]);
                break;
            }

            case 'question_and_answer.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('FAQ'), '<none>'),]);
                break;
            }

            case 'collect_points.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Collect points'), '<none>'),]);
                break;
            }

            case 'discount_point.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Reddem points for discount'), '<none>'),]);
                break;
            }

            case 'pointfree.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Redeem points for free items'), '<none>'),]);
                break;
            }

            case 'search.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Search'), '<none>'),]);
                break;
            }

            case 'promotion_detail.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('รายละเอียดโปรโมชั่น'), '<none>'),]);
                break;
            }

            case 'special_sticker.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('บิ๊กสติ๊กเกอร์พิเศษ'), '<none>'),]);
                break;
            }

            case 'step_to_join.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('ขั้นตอนในการเข้าร่วม'), '<none>'),]);
                break;
            }

            case 'sp.form':{
                $route_match = \Drupal::service('current_route_match');
                $tid = $route_match->getParameter('tid');

                switch( $tid ){
                    // อาหาร & เครื่องดื่ม
                    case '57942':{
                        $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                                Link::createFromRoute(t('Food & Beverages'), '<none>'),]);
                    break;
                    }

                    // โรงแรม ที่พัก & ท่องเที่ยว
                    case '57943':{
                        $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                                Link::createFromRoute(t('Hotels & Travel'), '<none>'),]);
                    break;
                    }

                    // สุขภาพ & ความงาม
                    case '57944':{
                        $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                                Link::createFromRoute(t('Health & Beauty'), '<none>'),]);
                    break;
                    }

                    // การศึกษา
                    case '57945':{
                        $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                                Link::createFromRoute(t('Education'), '<none>'),]);
                    break;
                    }

                    // ไลฟ์สไตล์
                    case '57946':{
                        $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                        Link::createFromRoute(t('Lifestyles'), '<none>'),]);
                    break;
                    }


                }

            break;
            }

            case 'sp_detail.form':{
                $route_match = \Drupal::service('current_route_match');
                $nid = $route_match->getParameter('nid');

                $node = Node::load($nid);
                if(!empty($node)){
                    $type_privilege = $node->get('field_type_privilege')->target_id;

                    $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($type_privilege);
                    $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                            Link::fromTextAndUrl(t($term->label()), Url::fromRoute('sp.form', array('tid' => $type_privilege ))),
                                            Link::createFromRoute(t($node->label()), '<none>'),
                                            ]);
                }
            break;
            }

            case 'forgotpassword.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Forgot password'), '<none>'),]);
            break;
            }

            case 'register.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Add new user'), '<none>'),]);
            break;
            }

            case 'create_shortlink.form':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute(t('Create short link'), '<none>'),]);
            break;
            }

            case 'preview_shortlink.form':{
                $secret_key = \Drupal::service('current_route_match')->getParameter('secret_key'); 
                $query = \Drupal::entityQuery('node');
                $query->condition('type', 'short_link');
                $query->condition('field_secret_key', $secret_key);
                $query->range(0,1);
                $results = $query->execute();

                foreach ($results as $nid){             
                    $node   = Node::load($nid);
                    $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                    Link::createFromRoute( $node->label() , '<none>'),]);
                }
            break;
            }

            case 'extra_menu.form':{
                $tid = \Drupal::service('current_route_match')->getParameter('tid'); 
                $term_tid = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tid);


                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                Link::createFromRoute( empty($term_tid) ? '' : $term_tid->label() , '<none>'),]);

            break;
            }

            case 'view.content.page_2':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('Short link'), '<none>'),]);

            break;
            }

            case 'view.content.page_3':{
                $breadcrumb->setLinks([ Link::createFromRoute(t('Home'), '<front>'),
                                        Link::createFromRoute(t('The shop privilege'), '<none>'),]);

            break;
            }
            */
        }
        
        return $breadcrumb;
    }
}