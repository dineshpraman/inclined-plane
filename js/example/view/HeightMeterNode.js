/************************************************
*		HeightMeterNode			*
*************************************************
/**
 * Displays the Panel for controlling the Ramp Height 
 * 
 * @author Dinesh
 * Based on pH scale/PHMeterNode.js (many modifications though)
 */

define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var HString = 'Ramp Height';
  var pattern_0value_1units = require( 'string!EXAMPLE_SIM/pattern_0value_1units' );


  // constants
  var X_MARGIN = 14;
  var Y_MARGIN = 10;
  var CORNER_RADIUS = 6;
  var SPINNER_DELTA = 0.01;
  var SPINNER_X_SPACING = 6;
  var SPINNER_Y_SPACING = 4;
  var SPINNER_INTERVAL_DELAY = 40;
  var SPINNER_ARROW_COLOR = 'rgb(0,200,0)';
  var DECIMAL_PLACES=2;
  var DIGITS=3; //max no. of digits that will be displayed (for sizing purposes)
	

  /**
   * Value is displayed inside of this.
   *
   * @param {boolean} isInteractive
   * @constructor
   */
  function ValueNode( Truck , isInteractive ) {

    var thisNode = this;
    Node.call( thisNode );

    var minH=Truck.minH;  
    var maxH=Truck.maxH;

    var scale=Truck.scale;

    var H_RANGE= new Range(minH,maxH); //default height range

    var Height=new Property((Truck.rampHeight+Truck.baseHeight)/scale);  // height property


    var valueText = new Text( Util.toFixed( Math.pow(10,DIGITS) , DECIMAL_PLACES),  //the maximum width of the box is = size (DIGITS + DECIMAL_places)
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
//        valueText.text = Util.toFixed( height, DECIMAL_PLACES );
	 valueText.text = StringUtils.format( pattern_0value_1units, height.toFixed(DECIMAL_PLACES), 'm' );
        valueText.right = valueRectangle.right - valueXMargin; // right justified
    } );


    // optional spinner arrows
    if ( isInteractive ) {

      var upArrowNode, downArrowNode;

      // options common to both arrow buttons
      var arrowButtonOptions = { intervalDelay: SPINNER_INTERVAL_DELAY,  arrowFill: SPINNER_ARROW_COLOR};

      // up arrow
      upArrowNode = new ArrowButton( 'up',
        function() { // increase the height when up button is pressed)
          Height.value= Math.min( H_RANGE.max, Height.value + SPINNER_DELTA ) ;
	  Truck.truckLength=Math.max(scale*Height.value,50);
	  Truck.baseHeight=scale*Height.value*1/3;  //proportionally split the totalHeight between baseHeight and rampHeight
          Truck.rampHeight=scale*Height.value*2/3;

        },
        _.extend( {
	  scale:0.75,
          left: valueRectangle.right + SPINNER_X_SPACING,
          bottom: valueRectangle.centerY - ( SPINNER_Y_SPACING / 2 )
        }, arrowButtonOptions )
      );
      valueNode.addChild( upArrowNode );


      // down arrow
      downArrowNode = new ArrowButton( 'down',
        function() { // increase the height when up button is pressed)
          Height.value=Math.max( H_RANGE.min,  Height.value - SPINNER_DELTA ) ;
	  Truck.truckLength=Math.max(scale*Height.value,50);	 
	  Truck.baseHeight=scale*Height.value*1/3; //proportionally split the totalHeight between baseHeight and rampHeight
          Truck.rampHeight=scale*Height.value*2/3; 
        },
        _.extend( {
          scale:0.75,
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
   var labelNode = new Text( HString, { fill: 'black', font: new PhetFont( { size: 14 , weight: 'bold' } ) } );

    thisNode.addChild( labelNode );
    thisNode.addChild( valueNode );

    // layout
     labelNode.top = labelNode.height +Y_MARGIN;
    labelNode.left = X_MARGIN;
    valueNode.centerX = (labelNode.width +2*X_MARGIN)/2 ; //center point
    valueNode.top = labelNode.bottom + Y_MARGIN;


   Truck.rampHeightProperty.link( function() {
	Height.value=(Truck.rampHeight+Truck.baseHeight)/scale; 
    } );

   Truck.rampLengthProperty.link( function() {
	var L=Truck.totalLength/scale;
	var rLmax=Truck.rLmax;
	var maxH_new=Math.min( Truck.rampLength /scale , maxH);  //limit the maximum height so that height (limiting case: totalHeight=rampLength, angle=45 deg)
	H_RANGE=new Range(minH, maxH_new);
        upArrowNode.enabled = ( Height.value < H_RANGE.max );
        downArrowNode.enabled = ( Height.value > H_RANGE.min );
    } );


  }

  inherit( Node, ValueNode );

 
 /**
   * @param {Object} [options]
   * @constructor
   */
  function HeightMeterNode( Truck, options ) {

    options = _.extend( {
      isInteractive: false, // true: pH can be changed, false: pH is read-only
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // nodes
    var valueNode = new ValueNode(Truck, options.isInteractive );


    // rendering order
    thisNode.addChild( valueNode );
    thisNode.mutate( options );
  }

  return inherit( Node, HeightMeterNode );
} );
