/**
 * External dependencies
 */
import classnames from 'classnames';

import {
	blockDefault,
	blockTable,
	file
} from '@wordpress/icons';

/**
 * WordPress dependencies
 */
const {
	startCase,
	toLower
} = lodash;

const { __ } = wp.i18n;

const {
	Button,
	Dashicon,
	Icon,
	TextControl,
	Tooltip,
	SelectControl
} = wp.components;

/**
 * Internal dependencies
 */
import { otterIcon } from '../../../helpers/icons.js';

const Header = ({
	preview,
	tab,
	blocksCategories,
	templateCategories,
	selectedCategory,
	selectedTemplate,
	search,
	setPreview,
	changeTab,
	close,
	importTemplate,
	selectCategory,
	changeSearch
}) => {
	const getOptions = () => {
		let categories = {};

		categories = ( 'block' === tab ? blocksCategories : templateCategories ).map( i => {
			return i = {
				label: startCase( toLower( i ) ),
				value: i
			};
		});

		const options = [
			{ label: __( 'All Categories' ), value: 'all' },
			...categories
		];

		return options;
	};

	const options = getOptions();

	return (
		<div className="wp-block-themeisle-library-modal-control-panel">
			<div className="wp-block-themeisle-library-modal-header">
				<div className="wp-block-themeisle-library-modal-header-logo">
					{ preview ? (
						<Button
							className="wp-block-themeisle-library-modal-header-tabs-button back-to-library"
							aria-label={ __( 'Back to Library' ) }
							onClick={ () => setPreview( false ) }
						>
							<Dashicon icon="arrow-left-alt" /> { __( 'Back to Library' ) }
						</Button>
					) :
						<div className="wp-block-themeisle-library-modal-header-tabs-button">
							<Icon icon={ otterIcon } />
						</div>
					}
				</div>

				{ ! preview && (
					<div className="wp-block-themeisle-library-modal-header-tabs">
						<Button
							className={ classnames(
								'wp-block-themeisle-library-modal-header-tabs-button',
								{ 'is-selected': 'block' === tab }
							) }
							onClick={ () => changeTab( 'block' ) }
						>
							<Icon icon={ blockDefault } />
							{ __( 'Blocks' ) }
						</Button>

						<Button
							className={ classnames(
								'wp-block-themeisle-library-modal-header-tabs-button',
								{ 'is-selected': 'template' === tab }
							) }
							onClick={ () => changeTab( 'template' ) }
						>
							<Icon icon={ blockTable } />
							{ __( 'Templates' ) }
						</Button>

						<Button
							className={ classnames(
								'wp-block-themeisle-library-modal-header-tabs-button',
								{ 'is-selected': 'custom' === tab }
							) }
							onClick={ () => changeTab( 'custom' ) }
						>
							<Icon icon={ file } />
							{ __( 'Saved' ) }
						</Button>
					</div>
				) }

				<div className="wp-block-themeisle-library-modal-header-actions">
					{ preview && (
						<Button
							className="wp-block-themeisle-library-modal-header-tabs-button insert-button"
							onClick={ () => importTemplate( 'object' === typeof selectedTemplate ? selectedTemplate.template_url : selectedTemplate ) }
							tabindex="0"
						>
							<Dashicon icon="arrow-down-alt" size={ 16 } />
							{ __( 'Insert' ) }
						</Button>
					) }

					<Tooltip text={ __( 'Close' ) }>
						<Button
							className="wp-block-themeisle-library-modal-header-tabs-button"
							aria-label={ __( 'Close settings' ) }
							onClick={ close }
						>
							<Dashicon icon="no-alt" />
						</Button>
					</Tooltip>
				</div>
			</div>

			{ ! preview && 'custom' !== tab && (
				<div className="wp-block-themeisle-library-modal-actions">
					<SelectControl
						className="wp-block-themeisle-library-modal-category-control"
						value={ 'all' === selectedCategory ? 'all' : selectedCategory }
						onChange={ selectCategory }
						options={ options }
					/>

					<TextControl
						type="text"
						value={ search || '' }
						placeholder={ __( 'Search' ) }
						className="wp-block-themeisle-library-modal-search-control"
						onChange={ changeSearch }
					/>
				</div>
			) }
		</div>
	);
};

export default Header;
