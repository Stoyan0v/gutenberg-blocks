/**
 * External dependencies.
 */
import {
	alignCenter,
	alignLeft,
	alignRight
} from '@wordpress/icons';

/**
 * WordPress dependencies...
 */
const { __ } = wp.i18n;

const {
	AlignmentToolbar,
	BlockControls
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import LinkControl from '../../components/link-control/index.js';

const Controls = ({
	attributes,
	setAttributes,
	isSelected
}) => {
	return (
		<BlockControls>
			<AlignmentToolbar
				value={ attributes.align }
				onChange={ e => setAttributes({ align: e }) }
				alignmentControls={ [
					{
						icon: alignLeft,
						title: __( 'Align left' ),
						align: 'left'
					},
					{
						icon: alignCenter,
						title: __( 'Align center' ),
						align: 'center'
					},
					{
						icon: alignRight,
						title: __( 'Align right' ),
						align: 'right'
					}
				] }
			/>

			<LinkControl
				isSelected={ isSelected }
				setAttributes={ setAttributes }
				url={ attributes.link }
				opensInNewTab={ attributes.newTab }
			/>
		</BlockControls>
	);
};

export default Controls;
