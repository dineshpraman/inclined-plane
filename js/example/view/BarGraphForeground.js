/************************************************
*		BarGraphForeground		*
*************************************************
 *
 * Scenery node that shows animating bar chart bars as rectangles.  Should be shown in front of the
 * BarGraphBackground.  This was split into separate layers in order to keep the animation fast on iPad.
 *  Adapted from "Energy Skate Park Basics Simulation"
 *
 * @modified by Dinesh
 */


define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Color = require( 'SCENERY/util/Color' );

 var workColor= new Color( '#00cc1a' );
 var potentialEnergyColor= new Color( '#3282D7' );
 var thermalEnergyColor= new Color( '#FF5500' );  

  /**
   * Constructor for the BarGraph
   * @param {Mass} Mass object (model.Mass)
   * @param {barGraphbackGround}  BarGraphbackGround Node
   * @param {Property<Boolean>} barGraphVisibleProperty property that indicates whether the bar graph is visible
   * @param {string} barRenderer the renderer type to use for the bars.  For some reason it is not currently inherited.
   * @constructor
   */
  function BarGraphForeground( Mass, barGraphBackground, barGraphVisibleProperty, barRenderer ) {

    var barWidth = barGraphBackground.barWidth;
    var getBarX = barGraphBackground.getBarX;
    var originY = barGraphBackground.originY;

    // Create an energy bar that animates as the model moves
    var createBar = function( index, color, property ) {

      // Convert to graph coordinates
      // However, do not floor for values less than 1 otherwise a nonzero value will show up as zero, see #159

      var barHeightProperty = property.map( function( value ) {
        var result = value/20;

        // Floor and protect against duplicates.
        // Make sure that nonzero values are big enough to be visible, see #307
        return result > 1 ? Math.floor( result ) :
               result < 1E-6 ? 0 :
               1;
      } );

      var barX = getBarX( index );
      var bar = new Rectangle( barX, 0, barWidth, 100, {fill: color, pickable: false, renderer: barRenderer} );

      // update the bars when the graph becomes visible, and skip update when they are invisible
      DerivedProperty.multilink( [barHeightProperty, barGraphVisibleProperty], function( barHeight, visible ) {
        if ( visible ) {
          // PERFORMANCE/ALLOCATION: Possible performance improvement to avoid allocations in Rectangle.setRect

          // TODO: just omit negative bars altogether?
          if ( barHeight >= 0 ) {
            bar.setRect( barX, originY - barHeight, barWidth, barHeight );
          }
          else {
            bar.setRect( barX, originY, barWidth, -barHeight );
          }
        }
      } );
      return bar;
    };

    var workBar = createBar( 0, workColor, Mass.workProperty );
    var potentialBar = createBar( 1, potentialEnergyColor, Mass.potentialEnergyProperty );
    var thermalBar = createBar( 2, thermalEnergyColor, Mass.thermalEnergyProperty );

    Node.call( this, {

      // Manually align with the baseline of the bar chart.
      x: 24, y: 15,

      children: [
        workBar,
        potentialBar,
        thermalBar
      ]} );

    // When the bar graph is shown, update the bars (because they do not get updated when invisible for performance reasons)
    barGraphVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, BarGraphForeground );
} );
