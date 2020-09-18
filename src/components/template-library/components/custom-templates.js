/**
 * External dependencies
 */
import classnames from 'classnames';

import { moreVertical } from '@wordpress/icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const apiFetch = wp.apiFetch;

const {
	Button,
	DropdownMenu
} = wp.components;

const { useDispatch } = wp.data;

const { getDate } = wp.date;

const { useEffect } = wp.element;

const CustomTemplates = ({
	authors,
	customTemplates,
	setTemplates,
	setLoading,
	customTemplatesLoaded,
	setTemplatesLoaded,
	importPreview,
	importTemplate
}) => {
	const { createNotice } = useDispatch( 'core/notices' );

	useEffect( () => {
		if ( ! customTemplatesLoaded ) {
			fetchData();
		}
	}, []);

	const fetchData = async() => {
		setLoading( true );

		try {
			let data = await apiFetch({ path: 'wp/v2/otter_templates?context=edit' });
			setTemplatesLoaded( true );
			setTemplates( data );
		} catch ( error ) {
			createNotice(
				'error',
				__( 'There seems to be an error. Please try again.' ),
				{
					context: 'themeisle-blocks/notices/template-library',
					isDismissible: true
				}
			);
		}

		setLoading( false );
	};

	const deleteTemplate = async postId => {
		if ( ! confirm( __( 'Are you sure you want to delete this template?' ) ) ) {
			return;
		}

		setLoading( true );

		try {
			await apiFetch({ path: `wp/v2/otter_templates/${ postId }?force=true`, method: 'DELETE' });

			createNotice(
				'success',
				__( 'Template successfully deleted.' ),
				{
					type: 'snackbar'
				}
			);

			fetchData();
		} catch ( error ) {
			createNotice(
				'error',
				__( 'There seems to be an error. Please try again.' ),
				{
					context: 'themeisle-blocks/notices/template-library',
					isDismissible: true
				}
			);

			setLoading( false );
		}
	};

	const download = ( fileName, content, contentType ) => {
		const file = new window.Blob([ content ], { type: contentType });

		// IE11 can't use the click to download technique
		// we use a specific IE11 technique instead.
		if ( window.navigator.msSaveOrOpenBlob ) {
			window.navigator.msSaveOrOpenBlob( file, fileName );
		} else {
			const a = document.createElement( 'a' );
			a.href = URL.createObjectURL( file );
			a.download = fileName;
			a.style.display = 'none';
			document.body.appendChild( a );
			a.click();
			document.body.removeChild( a );
		}
	};

	const exportBlocks = template => {
		let fileName = template.title.raw + '.json';

		let data = {
			__file: 'wp_export',
			version: 2,
			content: template.content.raw
		};

		const fileContent = JSON.stringify({ ...data }, null, 2 );

		createNotice(
			'success',
			__( 'Template exported.' ),
			{
				type: 'snackbar'
			}
		);

		download( fileName, fileContent, 'application/json' );
	};

	return (
		<div
			className={ classnames(
				'wp-block-themeisle-library-modal-content',
				'is-custom-templates',
				{
					'is-empty': 0 >= customTemplates.length
				}
			) }
		>
			{ 1 <= customTemplates.length && (
				<div className="wp-block-themeisle-library-modal-content__table">
					<div className="wp-block-themeisle-library-modal-content__table_header wp-block-themeisle-library-modal-content__table_row">
						<div className="wp-block-themeisle-library-modal-content__table_row__coloum wp-block-themeisle-library-modal-content__table_row__coloum_name">
							{ __( 'Template Name' ) }
						</div>
						<div className="wp-block-themeisle-library-modal-content__table_row__coloum wp-block-themeisle-library-modal-content__table_row__coloum_author">
							{ __( 'Author' ) }
						</div>
						<div className="wp-block-themeisle-library-modal-content__table_row__coloum wp-block-themeisle-library-modal-content__table_row__coloum_date">
							{ __( 'Creation Date' ) }
						</div>
						<div className="wp-block-themeisle-library-modal-content__table_row__coloum wp-block-themeisle-library-modal-content__table_row__coloum_actions">
							{ __( 'Actions' ) }
						</div>
					</div>

					{ customTemplates.map( template => {
						const author = authors.find( author => author.id === template.author );
						const date = moment( getDate( template.date ) ).format( 'MMMM Do, YYYY' );

						return (
							<div className="wp-block-themeisle-library-modal-content__table_row">
								<div className="wp-block-themeisle-library-modal-content__table_row__coloum wp-block-themeisle-library-modal-content__table_row__coloum_name">
									{ template.title.rendered }
								</div>
								<div className="wp-block-themeisle-library-modal-content__table_row__coloum wp-block-themeisle-library-modal-content__table_row__coloum_author">
									{ author.name }
								</div>
								<div className="wp-block-themeisle-library-modal-content__table_row__coloum wp-block-themeisle-library-modal-content__table_row__coloum_date">
									{ date }
								</div>
								<div className="wp-block-themeisle-library-modal-content__table_row__coloum wp-block-themeisle-library-modal-content__table_row__coloum_actions">
									<Button
										isTertiary
										isSmall
										onClick={ () => importPreview( template.id ) }
									>
										{ __( 'Preview' ) }
									</Button>

									<Button
										isPrimary
										isSmall
										onClick={ () => importTemplate( template.id ) }
									>
										{ __( 'Insert' ) }
									</Button>

									<DropdownMenu
										icon={ moreVertical }
										label={ __( 'More actions' ) }
										controls={ [
											{
												title: __( 'Edit' ),
												onClick: () => window.open( window.themeisleGutenberg.adminPath + `post.php?post=${ template.id }&action=edit` )
											},
											{
												title: __( 'Delete' ),
												onClick: () => deleteTemplate( template.id )
											},
											{
												title: __( 'Export' ),
												onClick: () => exportBlocks( template )
											}
										] }
									/>
								</div>
							</div>
						);
					}) }
				</div>
			) }

			{ 0 >= customTemplates.length && (
				<div className="wp-block-themeisle-library-modal-content__instructions">
					<div className="wp-block-themeisle-library-modal-content__instructions_heading">
						{ __( 'Nothing to see here. Try saving a template first.' ) }
					</div>

					<div className="wp-block-themeisle-library-modal-content__instructions_image">
						<img src={ window.themeisleGutenberg.assetsPath + '/images/save-template.png' } />
					</div>
				</div>
			) }
		</div>
	);
};

export default CustomTemplates;
