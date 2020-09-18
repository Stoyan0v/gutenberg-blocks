/**
 * WordPress dependencies
 */
const { BlockPreview } = wp.blockEditor;

const { Spinner } = wp.components;

const { useViewportMatch } = wp.compose;

/**
 * Internal dependencies
 */
import Templates from './templates.js';
import CustomTemplates from './custom-templates.js';

const ContentArea = ({
	preview,
	data,
	authors,
	isLoading,
	setLoading,
	customTemplates,
	setTemplates,
	customTemplatesLoaded,
	setTemplatesLoaded,
	tab,
	selectedTemplateContent,
	selectedCategory,
	search,
	importPreview,
	importTemplate
}) => {
	const isLarger = useViewportMatch( 'large', '>=' );

	const isLarge = useViewportMatch( 'large', '<=' );

	const isSmall = useViewportMatch( 'small', '>=' );

	const isSmaller = useViewportMatch( 'small', '<=' );

	let viewportWidth = 1400;

	const isTablet = ! isLarger && ! isLarge && isSmall && ! isSmaller;

	const isMobile = ! isLarger && ! isLarge && ! isSmall && ! isSmaller;

	if ( isTablet ) {
		viewportWidth = 960;
	} else if ( isMobile ) {
		viewportWidth = 600;
	}

	if ( preview ) {
		return (
			<div className="wp-block-themeisle-library-modal-preview">
				<BlockPreview
					blocks={ selectedTemplateContent }
					viewportWidth={ viewportWidth }
				/>
			</div>
		);
	}

	if ( isLoading || 0 >= authors.length ) {
		return (
			<div className="wp-block-themeisle-library-modal-loader">
				<Spinner/>
			</div>
		);
	}

	if ( 'custom' === tab ) {
		return (
			<CustomTemplates
				authors={ authors }
				customTemplates={ customTemplates }
				setTemplates={ setTemplates }
				setLoading={ setLoading }
				customTemplatesLoaded={ customTemplatesLoaded }
				setTemplatesLoaded={ setTemplatesLoaded }
				importPreview={ importPreview }
				importTemplate={ importTemplate }
			/>
		);
	}

	return (
		<Templates
			data={ data }
			tab={ tab }
			selectedCategory={ selectedCategory }
			search={ search }
			importPreview={ importPreview }
			importTemplate={ importTemplate }
		/>
	);
};

export default ContentArea;
