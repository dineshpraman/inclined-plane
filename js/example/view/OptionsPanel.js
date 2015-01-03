/*
*****************************************
*		View for the Mass	*
*****************************************

 * Panel with Checkboxes to toggle visibility of bar graph and force arrow(vectors).
 * @author:Dinesh
 *
 */


define( function( require ) {
  'use strict';

  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var energyBarsString = require( 'string!EXAMPLE_SIM/energyBars' );
  var forceVectorsString = require( 'string!EXAMPLE_SIM/forceVectors' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  /**
   * Create the OptionsPanel
   * @param
   * @constructor
   */
  function OptionsPanel( viewProperties, options ) {
    options = _.extend( {}, options );
    Node.call( this, options );

    var fontOptions = {font: new PhetFont( 18 )};
    var controlPanel = new VerticalCheckBoxGroup( [
      {content: new Text( energyBarsString, fontOptions ), property: viewProperties.barGraphVisibleProperty, label: energyBarsString},
      {content: new Text( forceVectorsString, fontOptions ), property: viewProperties.vectorsVisibleProperty, label: forceVectorsString}
    ] );

    var panel= new Panel( controlPanel, {xMargin: 10, yMargin: 10, fill: 'rgb(240,240,240)'} );
    panel.scale(0.8);
    this.addChild( panel );

  }

  return inherit( Node, OptionsPanel );
} );

//
