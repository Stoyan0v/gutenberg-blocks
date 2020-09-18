/**
 * External dependencies
 */
import LazyLoad from 'react-lazy-load';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import Template from './template.js';

const TemplatesList = ({
	data,
	tab,
	selectedCategory,
	search,
	importPreview,
	importTemplate
}) => {
	return (
		<div className="wp-block-themeisle-library-modal-content">
			{ data.map( i => {
				if (
					( i.template_url ) &&
						( 'all' === selectedCategory || i.categories && i.categories.includes( selectedCategory ) ) &&
						( ! search || i.keywords && i.keywords.some( o => o.toLowerCase().includes( search.toLowerCase() ) ) ) &&
						( tab === i.type )
				) {
					return (
						<Template
							template={ i }
							importPreview={ importPreview }
							importTemplate={ importTemplate }
						/>
					);
				}
			}) }

			<div
				aria-label={ __( 'Coming Soon' ) }
				className="wp-block-themeisle-library-modal-content__item"
			>
				<div className="wp-block-themeisle-library-modal-content__preview">
					<LazyLoad>
						<img src={ 'https://raw.githubusercontent.com/Codeinwp/gutenberg-templates/master/assets/images/coming-soon.jpg' } />
					</LazyLoad>
				</div>
			</div>
		</div>
	);
};

export default TemplatesList;
