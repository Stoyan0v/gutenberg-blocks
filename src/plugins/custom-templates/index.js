/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const apiFetch = wp.apiFetch;

const { serialize } = wp.blocks;

const {
	Button,
	Modal,
	TextControl
} = wp.components;

const {
	useSelect,
	useDispatch
} = wp.data;

const { PluginBlockSettingsMenuItem } = wp.editPost;

const {
	Fragment,
	useState
} = wp.element;

const CustomTemplates = () => {
	const [ isOpen, setOpen ] = useState( false );
	const [ isLoading, setLoading ] = useState( false );
	const [ title, setTitle ] = useState( '' );

	const { content, getCurrentUser } = useSelect( ( select ) => {
		const { getCurrentUser } = select( 'core' );
		const { getSelectedBlockCount, getSelectedBlock, getMultiSelectedBlocks } = select( 'core/block-editor' );
		const blocks = 1 === getSelectedBlockCount() ? getSelectedBlock() : getMultiSelectedBlocks();

		return {
			content: serialize( blocks ),
			getCurrentUser
		};
	});

	const { createSuccessNotice } = useDispatch( 'core/notices' );

	const onSave = async() => {
		setLoading( true );

		try {
			await apiFetch({
				path: 'wp/v2/otter_templates',
				method: 'POST',
				data: {
					title: title || __( 'Template' ),
					author: getCurrentUser().id || 1,
					content,
					status: 'publish'
				}
			});

			setOpen( false );
			setTitle( '' );

			createSuccessNotice( __( 'Template saved successfully.' ), {
				type: 'snackbar'
			});
		} catch ( error ) {
			createSuccessNotice( __( 'There seems to be an error. Please try again.' ), {
				type: 'snackbar'
			});
		}

		setLoading( false );
	};

	return (
		<Fragment>
			<PluginBlockSettingsMenuItem
				label={ __( 'Add to Saved Templates' ) }
				icon={ 'none' } // We don't want an icon, as new UI of Gutenberg does't have icons for Menu Items, but the component doesn't allow that so we pass an icon which doesn't exist.
				onClick={ () => setOpen( true ) }
			/>

			{ isOpen && (
				<Modal
					title={ __( 'Add Custom Template' ) }
					onRequestClose={ () => setOpen( false ) }
				>
					<TextControl
						label={ __( 'Template Title' ) }
						value={ title }
						onChange={ setTitle }
					/>

					<Button
						isPrimary
						isPressed={ isLoading }
						isBusy={ isLoading }
						onClick={ onSave }
					>
						{ __( 'Save' ) }
					</Button>
				</Modal>
			) }
		</Fragment>
	);
};

export default CustomTemplates;
