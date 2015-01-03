/************************************************
*		BarGraphBackground		*
*************************************************
/** 
 * Scenery node that shows static background for the bar graph, including the title, axes, labels. 
 * This was split into separate layers in order to keep the animation fast (while still looking crisp) on iPad.
 *  Adapted from "Energy Skate Park Basics Simulation"
 *
 * @modified by Dinesh
 */


define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var Color = require( 'SCENERY/util/Color' );

 var workColor= new Color( '#00cc1a' );
 var potentialEnergyColor= new Color( '#3282D7' );
 var thermalEnergyColor= new Color( '#FF5500' );  

  /**
   * Constructor for the BarGraph
   * @param {Property<Boolean>} barGraphVisibleProperty property that indicates whether the bar graph is visible
   * @constructor
   */
  function BarGraphBackground( barGraphVisibleProperty  ) {

    var barGraphBackground = this;

    // Free layout parameters

//    var contentWidth = 110;		// 4 labels
//    var contentWidth = 55;		// 2 labels

    var contentWidth = 82.5;		// 3 labels
    var contentHeight = 250*3/2;  	
    var insetX = 2;
    var insetY = 25;

    var numBars = 3;
    var spaceBetweenBars = 10;
    var spaceBetweenAxisAndBar = 10;
    var spaceBetweenRightSideAndBar = 5;
    this.barWidth = (contentWidth - insetX * 2 - (numBars - 1) * spaceBetweenBars - spaceBetweenAxisAndBar - spaceBetweenRightSideAndBar) / numBars;

    this.originY = contentHeight - insetY;

    // The x-coordinate of a bar chart bar
    this.getBarX = function( barIndex ) { return insetX + spaceBetweenAxisAndBar + barGraphBackground.barWidth * barIndex + spaceBetweenBars * barIndex; };

    // Create a label that appears under one of the bars
    var createLabel = function( index, title, color ) {
      var text = new Text( title, {fill: color, font: new PhetFont( 14 ), pickable: false} );
      text.rotate( -Math.PI / 2 );
      text.centerX = barGraphBackground.getBarX( index ) + barGraphBackground.barWidth / 2;
      text.top = barGraphBackground.originY + 2;

      return text;
    };

    var kineticLabel = createLabel( 0, 'Work', workColor );
    var potentialLabel = createLabel( 1, 'Potential', potentialEnergyColor );
    var thermalLabel = createLabel( 2, 'Thermal', thermalEnergyColor );

    var titleNode = new Text( 'Energy', {x: 5, top: 0, font: new PhetFont( 14 ), pickable: false} );
    var contentNode = new Rectangle( 0, 0, contentWidth, contentHeight, {children: [
      new ArrowNode( insetX, this.originY, insetX, insetY, {pickable: false} ),
      titleNode,
      new Line( insetX, this.originY, contentWidth - insetX, this.originY, {lineWidth: 1, stroke: 'gray', pickable: false} ),
      kineticLabel,
      potentialLabel,
      thermalLabel
    ]} );

    // Center the bar chart title, see #62
    titleNode.centerX = contentNode.centerX;

    Panel.call( this, contentNode, { x: 10, y: 10, xMargin: 10, yMargin: 5, fill: 'white', stroke: 'gray', lineWidth: 1, resize: false} );

    // When the bar graph is shown, update the bars (because they do not get updated when invisible for performance reasons)
    barGraphVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Panel, BarGraphBackground );
} );

