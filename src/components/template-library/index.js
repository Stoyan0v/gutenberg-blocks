/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const apiFetch = wp.apiFetch;

const { parse } = wp.blocks;

const { Modal } = wp.components;

const {
	useSelect,
	useDispatch
} = wp.data;

const {
	useEffect,
	useState
} = wp.element;

/**
 * Internal dependencies
 */
import './editor.scss';
import Header from './components/header.js';
import Notices from './components/notices.js';
import ContentArea from './components/content-area.js';

const Library = ({
	clientId,
	close
}) => {
	const block = useSelect( select => select( 'core/block-editor' ).getBlock( clientId ) );
	const authors = useSelect( select => select( 'core' ).getAuthors() );

	const { replaceBlocks } = useDispatch( 'core/block-editor' );
	const { createNotice } = useDispatch( 'core/notices' );

	useEffect( () => {
		const fetchData = async() => {
			if ( ! Boolean( window.themeisleGutenberg.isCompatible ) ) {
				createNotice(
					'warning',
					__( 'You are using an older version of Otter. Use the latest version of Otter to have maximum compatibility with Template Library.' ),
					{
						context: 'themeisle-blocks/notices/template-library',
						id: 'compatibility-warning',
						isDismissible: false,
						actions: [
							{
								label: __( 'Update Now' ),
								url: window.themeisleGutenberg.updatePath
							}
						]
					}
				);
			}

			try {
				let data = await apiFetch({ path: 'themeisle-gutenberg-blocks/v1/fetch_templates' });

				let blocksCategories = [];
				let templateCategories = [];

				data.map( i => {
					if ( i.categories && i.template_url ) {
						if ( 'block' === i.type ) {
							i.categories.map( o => {
								blocksCategories.push( o );
							});
						}

						if ( 'template' === i.type ) {
							i.categories.map( o => {
								templateCategories.push( o );
							});
						}
					}
				});

				blocksCategories = blocksCategories.filter( ( item, i, ar ) => ar.indexOf( item ) === i ).sort();
				templateCategories = templateCategories.filter( ( item, i, ar ) => ar.indexOf( item ) === i ).sort();

				setBlocksCategories( blocksCategories );
				setTemplateCategories( templateCategories );
				setData( data );
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

		fetchData();
	}, []);

	const [ tab, setTab ] = useState( 'block' );
	const [ isLoading, setLoading ] = useState( true );
	const [ selectedCategory, setSelectedCategory ] = useState( 'all' );
	const [ search, setSearch ] = useState( '' );
	const [ blocksCategories, setBlocksCategories ] = useState([]);
	const [ templateCategories, setTemplateCategories ] = useState([]);
	const [ data, setData ] = useState([]);
	const [ customTemplates, setTemplates ] = useState([]);
	const [ customTemplatesLoaded, setTemplatesLoaded ] = useState( false );
	const [ preview, setPreview ] = useState( false );
	const [ selectedTemplate, setSelectedTemplate ] = useState( null );
	const [ selectedTemplateContent, setSelectedTemplateContent ] = useState( null );

	const importBlocks = content => replaceBlocks(
		block.clientId,
		content
	);

	const changeTab = value => {
		setTab( value );
		setSelectedCategory( 'all' );
		setSearch( '' );
	};

	const importPreview = async( template = null ) => {
		setLoading( true );

		try {
			let data;

			if ( 'number' === typeof template ) {
				data = await apiFetch({ path: `wp/v2/otter_templates/${ template }?context=edit` });
				data = parse( data.content.raw );
			} else {
				data = await apiFetch({ path: `themeisle-gutenberg-blocks/v1/import_template?url=${ template.template_url }&preview=true` });

				if ( data.__file && data.content && 'wp_export' === data.__file ) {
					data = parse( data.content );
				}
			}

			setSelectedTemplate( template );
			setSelectedTemplateContent( data );
			setPreview( true );
		} catch ( error ) {
			if ( error.message ) {
				createNotice(
					'error',
					error.message,
					{
						context: 'themeisle-blocks/notices/template-library',
						isDismissible: true
					}
				);
			}
		}

		setLoading( false );
	};

	const importTemplate = async template => {
		setPreview( false );
		setLoading( true );

		try {
			let data;

			if ( 'number' === typeof template ) {
				data = await apiFetch({ path: `wp/v2/otter_templates/${ template }?context=edit` });
				data = parse( data.content.raw );
			} else {
				data = await apiFetch({ path: `themeisle-gutenberg-blocks/v1/import_template?url=${ template }` });

				if ( data.__file && data.content && 'wp_export' === data.__file ) {
					data = parse( data.content );
				}

				if ( template.includes( 'https://raw.githubusercontent.com/Codeinwp/' ) && window.themeisleGutenberg.dataLogging.templates && Boolean( window.themeisleGutenberg.canTrack ) ) {
					const obj = window.themeisleGutenberg.dataLogging.templates.find( template => template.url === template );

					if ( obj ) {
						obj.instances = obj.instances + 1;
					} else {
						window.themeisleGutenberg.dataLogging.templates.push({
							url: template,
							instances: 1
						});
					}
				}
			}

			importBlocks( data );
		} catch ( error ) {
			if ( error.message ) {
				createNotice(
					'error',
					error.message,
					{
						context: 'themeisle-blocks/notices/template-library',
						isDismissible: true
					}
				);
			}

			setLoading( false );
		}
	};

	return (
		<Modal
			className={ classnames(
				'wp-block-themeisle-library-modal',
				{ 'is-preview': preview }
			) }
			onRequestClose={ close }
			shouldCloseOnClickOutside={ false }
		>
			<Header
				preview={ preview }
				tab={ tab }
				changeTab={ changeTab }
				blocksCategories={ blocksCategories }
				templateCategories={ templateCategories }
				selectedTemplate={ selectedTemplate }
				selectedCategory={ selectedCategory }
				search={ search }
				setPreview={ setPreview }
				close={ close }
				importTemplate={ importTemplate }
				selectCategory={ e => setSelectedCategory( e ) }
				changeSearch={ e => setSearch( e ) }
			/>

			<Notices/>

			<ContentArea
				preview={ preview }
				data={ data }
				authors={ authors }
				isLoading={ isLoading }
				setLoading={ setLoading }
				customTemplates={ customTemplates }
				setTemplates={ setTemplates }
				customTemplatesLoaded={ customTemplatesLoaded }
				setTemplatesLoaded={ setTemplatesLoaded }
				tab={ tab }
				selectedTemplateContent={ selectedTemplateContent }
				selectedCategory={ selectedCategory }
				search={ search }
				importPreview={ importPreview }
				importTemplate={ importTemplate }
			/>
		</Modal>
	);
};

export default Library;
