/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { debounce } = lodash;

const apiFetch = wp.apiFetch;

const {
	dispatch,
	select,
	subscribe
} = wp.data;

const { createSuccessNotice } = dispatch( 'core/notices' );

const savePostMeta = debounce( async() => {
	const { getCurrentPostId } = select( 'core/editor' );
	const postId = getCurrentPostId();

	try {
		await apiFetch({ path: `themeisle-gutenberg-blocks/v1/save_post_meta/${ postId }`, method: 'POST' });
	} catch ( error ) {
		createSuccessNotice( __( 'There seems to be an error. Please try again.' ), {
			type: 'snackbar'
		});
	}
}, 1000 );

let reusableBlocks = {};

subscribe( () => {
	const {
		isCurrentPostPublished,
		isSavingPost,
		isPublishingPost,
		isAutosavingPost,
		__experimentalGetReusableBlocks,
		__experimentalIsSavingReusableBlock
	} = select( 'core/editor' );

	const isAutoSaving = isAutosavingPost();
	const isPublishing = isPublishingPost();
	const isSaving = isSavingPost();
	const isSavingReusableBlock = id => __experimentalIsSavingReusableBlock( id );
	const getReusableBlocks = __experimentalGetReusableBlocks();
	const postPublished = isCurrentPostPublished();

	getReusableBlocks.map( async block => {
		if ( block ) {
			const isBlockSaving = isSavingReusableBlock( block.id );

			if  ( isBlockSaving && ! block.isTemporary ) {
				reusableBlocks[ block.id ] = {
					id: block.id,
					isSaving: true
				};
			}

			if  ( ! isBlockSaving && ! block.isTemporary && !! reusableBlocks[ block.id ]) {
				if ( block.id === reusableBlocks[ block.id ].id && ( ! isBlockSaving && reusableBlocks[ block.id ].isSaving ) ) {
					reusableBlocks[ block.id ].isSaving = false;
					try {
						await apiFetch({ path: `themeisle-gutenberg-blocks/v1/save_block_meta/${ block.id }`, method: 'POST' });
					} catch ( error ) {
						createSuccessNotice( __( 'There seems to be an error. Please try again.' ), {
							type: 'snackbar'
						});
					}
				}
			}
		}
	});

	if ( ( isPublishing || ( postPublished && isSaving ) ) && ! isAutoSaving ) {
		savePostMeta();
	}
});
