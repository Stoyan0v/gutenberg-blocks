/*
	TODO: Move CSS to PHP when block is ready
*/
const Save = ({
	attributes,
	className
}) => {

	// Delete when PHP CSS file are ready
	const titleStyle = {
		color: attributes.titleColor,
		fontSize: attributes.fontSizeTitle
	}

	return (
		<div
			className={ className }
			id={ attributes.id }
			data-percentage={ attributes.percentage }
			data-duration={ attributes.duration }
			data-height={ attributes.height }
			data-stroke-width={ attributes.strokeWidth }
			data-font-size-percent={ attributes.fontSizePercent }
			data-background-stroke={ attributes.backgroundColor }
			data-progress-stroke={ attributes.progressColor }
		>
			{
				( 'default' === attributes.titleStyle ) && (
					<div
						className="wp-block-themeisle-blocks-circle-counter-title__area"
					>
						<span
							className="wp-block-themeisle-blocks-circle-counter-title__value"
							style={
								{ ...titleStyle }
							}
						>
							{ attributes.title }
						</span>
					</div>
				)
			}
			<div
				className="wp-block-themeisle-blocks-circle-counter__bar"
			>
			</div>
			{
				( 'bottom' === attributes.titleStyle ) && (
					<div
						className="wp-block-themeisle-blocks-circle-counter-title__area"
					>
						<span
							className="wp-block-themeisle-blocks-circle-counter-title__value"
							style={
								{ ...titleStyle }
							}
						>
							{ attributes.title }
						</span>
					</div>
				)
			}
		</div>
	);
};

export default Save;
