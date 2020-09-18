<?php
/**
 * Register Post Type.
 *
 * @package ThemeIsle\GutenbergBlocks\Plugins
 */

namespace ThemeIsle\GutenbergBlocks\Plugins;

/**
 * Class Post_Type
 */
class Post_Type {

	/**
	 * The main instance var.
	 *
	 * @var Post_Type
	 */
	protected static $instance = null;

	/**
	 * Initialize the class
	 */
	public function init() {
		add_action( 'init', array( $this, 'register_post_type' ), 99 );
	}

	/**
	 * Register Post Type
	 * 
	 * @since   1.5.8
	 * @access  public
	 */
	public function register_post_type() {
		$args = array(
			'label'               => __( 'Templates', 'text_domain' ),
			'description'         => __( 'Templates for Otter Blocks.', 'text_domain' ),
			'labels'              => array(
				'name'          => _x( 'Templates', 'Post Type General Name', 'text_domain' ),
				'singular_name' => _x( 'Template', 'Post Type Singular Name', 'text_domain' ),
			),
			'supports'            => array( 'title', 'author', 'editor' ),
			'hierarchical'        => true,
			'public'              => false,
			'show_ui'             => true,
			'show_in_menu'        => false,
			'show_in_admin_bar'   => false,
			'show_in_nav_menus'   => false,
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'capability_type'     => 'page',
			'show_in_rest'        => true,
		);

		register_post_type( 'otter_templates', $args );
	}

	/**
	 * The instance method for the static class.
	 * Defines and returns the instance of the static class.
	 *
	 * @static
	 * @since 1.5.8
	 * @access public
	 * @return Post_Type
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Throw error on object clone
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object therefore, we don't want the object to be cloned.
	 *
	 * @access public
	 * @since 1.5.8
	 * @return void
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden.
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Cheatin&#8217; huh?', 'textdomain' ), '1.0.0' );
	}

	/**
	 * Disable unserializing of the class
	 *
	 * @access public
	 * @since 1.5.8
	 * @return void
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden.
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Cheatin&#8217; huh?', 'textdomain' ), '1.0.0' );
	}
}
