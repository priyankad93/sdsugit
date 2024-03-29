<?php
/**
 * Template Name: BHETA Resources Search Results
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package WordPress
 * @subpackage Twenty_Ten
 * @since Twenty Ten 1.0
 */

get_header(); ?>
		
		<div id="container">
			<?php if ( function_exists('yoast_breadcrumb') ) {
yoast_breadcrumb('<span class="breadcrumbs">','</span>');
} ?>
			<div class="sidebar_wrapper">
				
				<?php get_sidebar(); ?>
				
			</div><!-- sidebar wrapper -->
			<div class="content_wrapper">
				<div id="content">
					<h1 class="entry-title"><?php the_title(); ?></h1>
					
					<?php get_template_part( 'loop', 'page' ); ?>
					<hr/>
					
		<?php 
				
			$linkpath = get_bloginfo('url');
		
			$args = array();
			
			$args['relevanssi'] = true;
			
			$args['form'] = array('action' => $linkpath . '/programs/bheta/bheta-resources/bheta-search-results');

			$args['wp_query'] = array('post_type' => 'bhetaresources',
			                                // 'posts_per_page' => 1,
			                                'order' => 'ASC',
			                                'orderby' => 'name');
			                                
			
			$args['fields'][] = array('type' => 'search',
			                                'label' => 'Search by Keywords:',
			                                'value' => '');

						
			

			$args['fields'][] = array('type' => 'taxonomy',
				                                // 'label' => 'Search by Category:',
				                                'taxonomy' => 'bheta-resources-categories',
				                                'format' => 'radio',
				                                'operator' => 'AND');
			
			
			
      $args['fields'][] = array('type' => 'submit',
			                                'value' => 'Search');
			                               
			                               
		         
			$my_search_object = new WP_Advanced_Search($args); ?>

			
			
			<?php $my_search_object->the_form(); { ?> 
				<a title="Reset the Search Filter" class="search_reset" href="<?php bloginfo( 'url') ?>/programs/bheta/bheta-resources">Reset</a><br/><hr style="margin:17px 0;"/>
			<?php } ?>
			
			<?php $temp_query = $wp_query;
			$wp_query = $my_search_object->query();?>
			
			<h2 class="results-count">
           Displaying <?php // echo $my_search_object->results_range(); ?> 
           <!-- of  --><?php echo $wp_query->found_posts; ?> results
         </h2>
			

			<?php if ( have_posts() ):while ( have_posts() ): the_post(); ?>
					
				<?php include("my-resource-loop.php"); ?>
				<hr/>
			<?php
				endwhile; 

			$my_search_object->pagination();

			else :

				echo '<span class="noposts"=>Sorry, no posts matched your criteria.</span';

			endif;
			
			$wp_query = $temp_query;
			wp_reset_query();
		?>

					</div><!-- content -->
				
				<a href="#top" class="back_to_top" title="Back to Top">Back To Top</a>
				<?php include("my-access-notes-loop.php"); ?>
			</div><!-- content wrapper -->
		</div><!-- #container -->


<?php get_footer(); ?>
