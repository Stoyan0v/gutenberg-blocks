/**
 * External dependencies
 */
import classnames from 'classnames';
import hexToRgba from 'hex-rgba';

/**
 * Internal dependencies
 */
import { unescapeHTML } from '../../../helpers/helper-functions.js';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { RichText } = wp.blockEditor;

const { Fragment } = wp.element;

const Button = ({
	index,
	attributes,
	changeButton,
	updateButton
}) => {
	let boxShadowStyle = {};

	if ( attributes.data[index].boxShadow ) {
		boxShadowStyle = {
			boxShadow: `${ attributes.data[index].boxShadowHorizontal }px ${ attributes.data[index].boxShadowVertical }px ${ attributes.data[index].boxShadowBlur }px ${ attributes.data[index].boxShadowSpread }px ${  hexToRgba( ( attributes.data[index].boxShadowColor ? attributes.data[index].boxShadowColor : '#000000' ), attributes.data[index].boxShadowColorOpacity ) }`
		};

	}
	const buttonStyle = {
		fontSize: `${ attributes.fontSize }px`,
		fontFamily: attributes.fontFamily,
		fontWeight: attributes.fontVariant,
		fontStyle: attributes.fontStyle,
		textTransform: attributes.textTransform,
		lineHeight: attributes.lineHeight && `${ attributes.lineHeight }px`,
		color: attributes.data[index].color,
		background: attributes.data[index].background,
		border: `${ attributes.data[index].borderSize }px solid ${ attributes.data[index].border }`,
		borderRadius: `${ attributes.data[index].borderRadius }px`,
		...boxShadowStyle,
		padding: `${ attributes.data[index].paddingTopBottom }px ${ attributes.data[index].paddingLeftRight }px `,
		marginLeft: 0 === index ? '0px' : `${ attributes.spacing / 2 }px`,
		marginRight: attributes.buttons === index + 1 ? '0px' : `${ attributes.spacing / 2 }px`
	};

	return (
		<Fragment>
			<style>
				{ `#${ attributes.id } .wp-block-themeisle-blocks-button-${ index }:hover {
							color: ${ attributes.data[index].hoverColor ? attributes.data[index].hoverColor : attributes.data[index].color } !important;
							background: ${ attributes.data[index].hoverBackground ? attributes.data[index].hoverBackground : attributes.data[index].background } !important;
							border: ${ attributes.data[index].borderSize }px solid ${ attributes.data[index].hoverBorder ? attributes.data[index].hoverBorder : attributes.data[index].border } !important;
							${ attributes.data[index].boxShadow && ( `box-shadow: ${ attributes.data[index].hoverBoxShadowHorizontal }px ${ attributes.data[index].hoverBoxShadowVertical }px ${ attributes.data[index].hoverBoxShadowBlur }px ${ attributes.data[index].hoverBoxShadowSpread }px ${  hexToRgba( ( attributes.data[index].hoverBoxShadowColor ? attributes.data[index].hoverBoxShadowColor : '#000000' ), attributes.data[index].hoverBoxShadowColorOpacity ) } !important;` ) }
						}` }
			</style>
			<div
				style={ buttonStyle }
				className={ classnames(
					'wp-block-themeisle-blocks-button',
					`wp-block-themeisle-blocks-button-${ index }`
				) }
				onClick={ () => changeButton( index ) }
			>
				{ ( 'left' === attributes.data[index].iconType || 'only' === attributes.data[index].iconType ) && (
					<i className={ classnames(
						attributes.data[index].prefix,
						'fa-fw',
						`fa-${ attributes.data[index].icon }`,
						{ 'margin-right': 'left' === attributes.data[index].iconType }
					) }>
					</i>
				) }

				{ 'only' !== attributes.data[index].iconType && (
					<RichText
						placeholder={ __( 'Add text…' ) }
						value={ attributes.data[index].text }
						aria-label={ unescapeHTML( attributes.data[index].text ) }
						onChange={ e => updateButton({ text: e }, index ) }
						formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
						allowedFormats={ [ 'core/bold', 'core/italic', 'core/strikethrough' ] }
						tagName="div"
						keepPlaceholderOnFocus
					/>
				) }

				{ 'right' === attributes.data[index].iconType && (
					<i className={ `${ attributes.data[index].prefix } fa-fw fa-${ attributes.data[index].icon } margin-left` }></i>
				) }
			</div>
		</Fragment>
	);
};

export default Button;
