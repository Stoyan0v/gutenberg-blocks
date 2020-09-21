/*
	TODO: Move CSS to PHP when block is ready
*/
const Save = ({
	attributes
}) => {
	const size = attributes.height;
	const center = attributes.height / 2;
	const radius = center -  attributes.strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;

	const fontSize = size * 0.30 + 'px';

	return (
		<div
			className="wp-block-themeisle-blocks-circular-progress-bar"
			data-percentage={ attributes.percentage }
			data-duration={ attributes.duration }
			data-circumference={ circumference }
		>
			{
				( 'default' === attributes.titleStyle ) && (
					<div
						className="wp-block-themeisle-blocks-circular-progress-bar-title__area"
					>
						<span
							className="wp-block-themeisle-blocks-circular-progress-bar-title__value"
							style={{
								color: attributes.titleColor,
								fontSize: fontSize
							}}
						>
							{ attributes.title }
						</span>
					</div>
				)
			}
			<div
				className="wp-block-themeisle-blocks-circular-progress-bar__bar"
				style={{
					height: size + 'px',
					width: size + 'px'
				}}
			>
				<svg
					className="wp-block-themeisle-blocks-circular-progress-bar-container"
					width={ size }
					height={ size }
				>
					<circle
						className="wp-block-themeisle-blocks-circular-progress-bar-bg"
						cx={ center }
						cy={ center }
						r={ radius }
						style={{
							stroke: attributes.backgroundColor,
							strokeWidth: attributes.strokeWidth
						}}
					/>
					<circle
						className="wp-block-themeisle-blocks-circular-progress-bar-progress"
						cx={ center }
						cy={ center }
						r={ radius }

						style={{
							strokeDasharray: circumference,
							stroke: attributes.progressColor,
							strokeWidth: attributes.strokeWidth
						}}
					/>
					<text
						className="wp-block-themeisle-blocks-circular-progress-bar-text"
						x="50%"
						y="50%"
						style={{
							fill: attributes.progressColor,
							fontSize: attributes.fontSize + 'px'
						}}
					>
					</text>
				</svg>
			</div>
		</div>
	);
};

export default Save;
