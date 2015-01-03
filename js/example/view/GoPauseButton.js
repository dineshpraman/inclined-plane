/************************************************
*		GoPauseButton			*
*************************************************

/**
 * A big round Go/Pause button that appears when the simulation starts(applied force arrow turns green)
 * which can be used to start/pause the animation.
 * Adapted from http://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html -> GoPauseButton
 *
 * @modified by Dinesh
 */


define( function( require ) {
  'use strict';

  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  
  var goString= 'Start';
  var pauseString= 'Pause';

  //Given nodes that have possibly different sizes, wrap the specified node in a parent empty Rectangle node so the bounds will match up
  //If the node is already the largest, don't wrap it.
  //Centers all the nodes in the parent wrappers

  function wrap( node, padX, padY, nodes ) {
    var maxWidth = -1;
    var maxHeight = -1;
    nodes.forEach( function( n ) {
      if ( n.width > maxWidth ) {
        maxWidth = n.width;
      }
      if ( n.height > maxHeight ) {
        maxHeight = n.height;
      }
    } );
    maxWidth += padX;
    maxHeight += padY;
    node.centerX = maxWidth / 2;
    node.centerY = maxHeight / 2;
    return new Rectangle( 0, 0, maxWidth, maxHeight, {children: [node]} );
  }

  /**
   * Create a GoPauseButton that appears below the candy cart when a puller has been attached to the rope.
   * @param {model} Simulation Model 
   * @constructor
   */

  function GoPauseButton( model ) {
    var goPauseButton = this;

    var padX = 15;
    var padY = 10;
    var goText = new Text( goString, {font: new PhetFont( 42 )} );
    var pauseText = new Text( pauseString, {font: new PhetFont( 30 )} );

    var goButton = new RoundPushButton( {content: wrap( goText, padX, padY, [goText, pauseText] ), baseColor: '#94b830', listener: function() {model.running = true;}} );//green
    var pauseButton = new RoundPushButton( {content: wrap( pauseText, padX, padY, [goText, pauseText] ), baseColor: '#df1a22', listener: function() {model.running = false;}} );//red

    var showGoButtonProperty = model.toDerivedProperty( ['running', 'state'], function( running, state ) {
      return !running;
    } );

//    var showGoButtonProperty=true;

    ToggleNode.call( this, goButton, pauseButton, showGoButtonProperty );

    //Show the go/pause button if the simulation is not completed

    model.stateProperty.link( function() {
      goPauseButton.visible = (model.state !== 'completed') ;
    } );


    //Add an accessibility peer to the Go/Pause button to enable keyboard access and screen reading
    //TODO: The peer should not be in the DOM if the button is invisible
    this.addPeer( '<input type="button" aria-label="Go/Pause">', {
      click: function() {
        model.running = !model.running;
      },

      //Visit this button after the user has added some pullers to the rope
      //TODO: Would benefit from a more natural traversal order
      tabIndex: 2
    } );

  }

  return inherit( ToggleNode, GoPauseButton );
} );
