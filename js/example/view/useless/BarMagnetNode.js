// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the bar magnet object, which can be dragged to translate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
//  var LinearFunction = require( 'DOT/LinearFunction' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // images
  var barMagnetImage = require( 'image!EXAMPLE_SIM/crate.png' );

  /**
   * Constructor for the BarMagnetNode which renders the bar magnet as a scenery node.
   * @param {BarMagnet} barMagnet the model of the bar magnet
   * @param {ModelViewTransform2} modelViewTransform the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function BarMagnetNode( barMagnet, modelViewTransform ) {

    var barMagnetNode = this;

    // Call the super constructor
    Node.call( barMagnetNode, {

      // Show a cursor hand over the bar magnet
      cursor: 'pointer'
    } );

    // Add the centered bar magnet image
    barMagnetNode.addChild( new Image( barMagnetImage, { centerX: 0, centerY: 0 } ) );

    // Scale it so it matches the model width and height

    barMagnetNode.scale( modelViewTransform.modelToViewDeltaX( barMagnet.size.width ) / this.width,
        modelViewTransform.modelToViewDeltaY( barMagnet.size.height ) / this.height );

    // When dragging, move the bar magnet
    barMagnetNode.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,

        // Translate on drag events
        translate: function( args ) {
          barMagnet.location = modelViewTransform.viewToModelPosition( args.position );
        },

	start: function( event, trail ) {
	barMagnet.userControlled = true;
	},

	end: function( event, trail ) {
	barMagnet.userControlled = false;
	}
      } ) );

    // Register for synchronization with model.
    barMagnet.locationProperty.link( function( location ) {
        barMagnetNode.translation = modelViewTransform.modelToViewPosition( location );
//	var translation= modelViewTransform.modelToViewPosition( location );
//	barMagnetNode.translation=new Vector2(translation.x,barMagnetNode.CenterY);
    } );

    // Register for synchronization with model
    barMagnet.orientationProperty.link( function( orientation ) {
      barMagnetNode.rotation = orientation;
    } );


    barMagnet.userControlledProperty.lazyLink( function( userControlled ) {
      barMagnetNode.userControlled = userControlled;
	if(!userControlled) {
		barMagnet.location=new Vector2( barMagnet.location.x, 0 );
	}
    } );

    barMagnet.massProperty.link( function( mass ) {
	var newSize=0.4*mass+50;
	barMagnetNode.scale(newSize/barMagnet.size.width);
	barMagnet.size = new Dimension2(newSize,newSize);
    } );

}

  return inherit( Node, BarMagnetNode );
} );
