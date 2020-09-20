/**
 * External dependencies
 */
import LazyLoad from 'react-lazy-load';

import { moreVertical } from '@wordpress/icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const apiFetch = wp.apiFetch;

const {
	Button,
	ButtonGroup,
	DropdownMenu
} = wp.components;

const {
	useDispatch,
	useSelect
} = wp.data;

const Template = ({
	template,
	importPreview,
	importTemplate
}) => {
	const getCurrentUser = useSelect( ( select ) => select( 'core' ).getCurrentUser );

	const { createSuccessNotice } = useDispatch( 'core/notices' );

	const saveTemplate = async template => {
		try {
			createSuccessNotice( __( 'Saving template…' ), {
				type: 'snackbar'
			});

			const data = await apiFetch({ path: `themeisle-gutenberg-blocks/v1/import_template?url=${ template.template_url }` });

			if ( data.__file && data.content && 'wp_export' === data.__file ) {
				await apiFetch({
					path: 'wp/v2/otter_templates',
					method: 'POST',
					data: {
						title: template.title || __( 'Template' ),
						author: getCurrentUser().id || 1,
						content: data.content,
						status: 'publish'
					}
				});

				createSuccessNotice( __( 'Template saved successfully.' ), {
					type: 'snackbar'
				});
			}
		} catch ( error ) {
			createSuccessNotice( __( 'There seems to be an error. Please try again.' ), {
				type: 'snackbar'
			});
		}
	};

	return (
		<div
			aria-label={ template.title || __( 'Untitled Gutenberg Template' ) }
			className="wp-block-themeisle-library-modal-content__item"
			tabindex="0"
		>
			<div className="wp-block-themeisle-library-modal-content__preview">
				<LazyLoad>
					<img src={ template.screenshot_url || 'https://raw.githubusercontent.com/Codeinwp/gutenberg-templates/master/assets/images/default.jpg' } />
				</LazyLoad>
			</div>

			<div className="wp-block-themeisle-library-modal-content__footer">
				<div className="wp-block-themeisle-library-modal-content__footer_meta">
					<h4 className="wp-block-themeisle-library-modal-content__footer_meta_area">
						{ ( template.title ) && (
							template.title + ( template.author && __( ' by ' ) + template.author )
						) }

						{ ( ! template.title && template.author ) && (
							__( 'Author: ' ) + template.author
						) }
					</h4>
				</div>

				<div className="wp-block-themeisle-library-modal-content__footer_actions">
					<Button
						isSecondary
						isLarge
						className="wp-block-themeisle-library-modal-overlay__actions"
						onClick={ () => importPreview( template ) }
						tabindex="0"
					>
						{ __( 'Preview' ) }
					</Button>

					<ButtonGroup>
						<Button
							isPrimary
							isLarge
							className="wp-block-themeisle-library-modal-overlay__actions"
							onClick={ () => importTemplate( template.template_url ) }
							tabindex="0"
						>
							{ __( 'Insert' ) }
						</Button>

						<DropdownMenu
							icon={ moreVertical }
							label={ __( 'More actions' ) }
							toggleProps={ {
								isPrimary: true
							} }
							controls={ [
								{
									title: __( 'Add to Saved Template' ),
									onClick: () => saveTemplate( template )
								},
								{
									title: __( 'Export' ),
									onClick: () => window.open( template.template_url )
								}
							] }
						/>
					</ButtonGroup>
				</div>
			</div>
		</div>
	);
};

export default Template;
