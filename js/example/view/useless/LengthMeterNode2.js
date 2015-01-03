// Copyright 2002-2013, University of Colorado Boulder

/**
 * Origin is at top left.
 * The meter can be expanded and collapsed.
 * By default, the meter displays pH but does not allow you to change it.
 */

define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
//  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Range = require( 'DOT/Range' );

  // strings
  var HString = 'Height';


  // constants
  var X_MARGIN = 14;
  var Y_MARGIN = 10;
  var CORNER_RADIUS = 12;
  var SPINNER_DELTA = 0.1;
  var SPINNER_X_SPACING = 6;
  var SPINNER_Y_SPACING = 4;
  var SPINNER_INTERVAL_DELAY = 40;
  var SPINNER_ARROW_COLOR = 'rgb(0,200,0)';
  var DECIMAL_PLACES=1;
  var EXPAND_COLLAPSE_BUTTON_LENGTH=30;

  /**
   * Value is displayed inside of this, which sits above the scale.
   * Has an expand/collapse button for controlling visibility of the entire meter.
   * This button also causes the ValueNode to show/hide the value.
   *
   * @param {Property.<boolean>} expandedProperty
   * @param {boolean} isInteractive
   * @constructor
   */
  function ValueNode( Truck, expandedProperty, isInteractive ) {

    var thisNode = this;
    Node.call( thisNode );
 
    var Height=new Property(5);

    var H_RANGE= new Range(  1, 10, 7 );

    // Height value
    var valueText = new Text( Util.toFixed( H_RANGE.max , DECIMAL_PLACES),
      { fill: 'black', font: new PhetFont( 20 ) } );

    // rectangle that the value is displayed in
    var valueXMargin = 8;
    var valueYMargin = 5;
    var valueRectangle = new Rectangle( 0, 0, valueText.width + ( 2 * valueXMargin ), valueText.height + ( 2 * valueYMargin ), CORNER_RADIUS, CORNER_RADIUS,
      { fill: 'white', stroke: 'darkGray' } );

    // layout
    valueText.right = valueRectangle.right - valueXMargin;
    valueText.centerY = valueRectangle.centerY;

    // parent for all components related to the value
    var valueNode = new Node( { children: [ valueRectangle, valueText ] } );

   Height.link( function( height ) {
        valueText.text = Util.toFixed( height, DECIMAL_PLACES );
        valueText.right = valueRectangle.right - valueXMargin; // right justified
    } );


    // optional spinner arrows
    if ( isInteractive ) {

      var upArrowNode, downArrowNode;

      // options common to both arrow buttons
      var arrowButtonOptions = { intervalDelay: SPINNER_INTERVAL_DELAY,  arrowFill: SPINNER_ARROW_COLOR};

      // up arrow
      upArrowNode = new ArrowButton( 'up',
        function() {
          Height.value= Math.min( H_RANGE.max, Height.value + SPINNER_DELTA ) ;
          Truck.rampHeight=10*Height.value; 

        },
        _.extend( {
          left: valueRectangle.right + SPINNER_X_SPACING,
          bottom: valueRectangle.centerY - ( SPINNER_Y_SPACING / 2 )
        }, arrowButtonOptions )
      );
      valueNode.addChild( upArrowNode );


      // down arrow
      downArrowNode = new ArrowButton( 'down',
        function() {
          Height.value=Math.max( H_RANGE.min,  Height.value - SPINNER_DELTA ) ;
          Truck.rampHeight=10*Height.value; 
        },
        _.extend( {
          left: upArrowNode.left,
          top: upArrowNode.bottom + SPINNER_Y_SPACING
        }, arrowButtonOptions )
      );
      valueNode.addChild( downArrowNode );

      // touch areas, expanded mostly to the right

      var expandX = upArrowNode.width / 2;
      var expandY = 6;
      upArrowNode.touchArea = upArrowNode.localBounds.dilatedXY( expandX, expandY ).shifted( expandX, -expandY );
      downArrowNode.touchArea = downArrowNode.localBounds.dilatedXY( expandX, expandY ).shifted( expandX, expandY );
       Height.link( function( height ) {
        upArrowNode.enabled = ( height < H_RANGE.max );
        downArrowNode.enabled = ( height > H_RANGE.min );
      } );

    }


    // label above the value
    var labelNode = new Text( HString, { fill: 'black', font: new PhetFont( { size: 16 , weight: 'bold' } ) } );

    // expanded background
    var backgroundOptions = { fill: 'rgb(230,230,230)', stroke: 'black', lineWidth: 2 };
    var backgroundWidth = Math.max( labelNode.width, valueNode.width ) + ( 2 * X_MARGIN );
    var ySpacing = isInteractive ? 25 : 10;
    var expandedHeight = labelNode.height + valueNode.height + ( 2 * Y_MARGIN ) + ySpacing;
    var expandedRectangle = new Rectangle( 0, 0, backgroundWidth, expandedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // collapsed background
    var collapsedHeight = labelNode.height + ( 2 * Y_MARGIN );
    var collapsedRectangle = new Rectangle( 0, 0, backgroundWidth, collapsedHeight, CORNER_RADIUS, CORNER_RADIUS, backgroundOptions );

    // expand/collapse button
    var expandCollapseButton = new ExpandCollapseButton( expandedProperty, { sideLength: EXPAND_COLLAPSE_BUTTON_LENGTH } );
    expandCollapseButton.touchArea = Shape.bounds( expandCollapseButton.localBounds.dilatedXY( 10, 10 ) );

    // rendering order
    thisNode.addChild( collapsedRectangle );
    thisNode.addChild( expandedRectangle );
    thisNode.addChild( labelNode );
    thisNode.addChild( expandCollapseButton );
   thisNode.addChild( valueNode );

    // layout
    labelNode.top = expandedRectangle.top + Y_MARGIN;
    labelNode.left = X_MARGIN;
    valueNode.centerX = expandedRectangle.centerX;
    valueNode.top = labelNode.bottom + ySpacing;
    expandCollapseButton.right = expandedRectangle.right - X_MARGIN;
    expandCollapseButton.centerY = labelNode.centerY;

    // expand/collapse
    expandedProperty.link( function( expanded ) {
      expandedRectangle.visible = valueNode.visible = expanded;
      collapsedRectangle.visible = !expanded;

    } );
  }

  inherit( Node, ValueNode );

 
 /**
   * @param {Property.<boolean>} expandedProperty
   * @param {Object} [options]
   * @constructor
   */
  function HeightMeterNode( Truck, expandedProperty, options ) {

    options = _.extend( {
      isInteractive: false, // true: pH can be changed, false: pH is read-only
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var valueNode = new ValueNode(Truck, expandedProperty, options.isInteractive );

    // rendering order
    thisNode.addChild( valueNode );
    thisNode.mutate( options );
  }

  return inherit( Node, HeightMeterNode );
} );
