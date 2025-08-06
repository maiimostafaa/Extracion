import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

interface TastingWheelProps {
  tasteRating: Record<string, number>;
  onTasteRatingChange?: (taste: string, rating: number) => void; // Optional - makes it interactive
  containerSize?: number; // Optional - allows parent to specify size
}

const TastingWheel: React.FC<TastingWheelProps> = ({ tasteRating, onTasteRatingChange, containerSize }) => {
  const screenWidth = Dimensions.get('window').width;
  
  // Use containerSize if provided, otherwise calculate based on screen width
  const maxSize = containerSize || (screenWidth * 0.9); // Use 90% of screen width as default
  const textPadding = Math.max(35, maxSize * 0.12); // Scale text padding with size, minimum 35px
  const size = maxSize;
  const center = size / 2;
  const radius = center - textPadding; // Simplified - let text padding handle the spacing
  const strokeWidth = Math.max(1, size * 0.0045); // Scale stroke width with component size
  
  // Organized taste categories
  const tasteCategories = {
    'Mouth Feel': ['Gritty', 'Smooth', 'Body', 'Clean'],
    'Aroma': ['Fruity', 'Floral', 'Chocolate', 'Nutty', 'Caramel', 'Roasted', 'Cereal', 'Green'],
    'Taste': ['Sour', 'Bitter', 'Sweet', 'Salty']
  };

  const accentColor = '#8CDBED';
  const transparentColor = 'transparent';

  // Calculate angles for each main category - Aroma gets half, others get quarters
  const categoryAngles = {
    'Aroma': { start: 0, end: Math.PI }, // Top half (180°)
    'Taste': { start: Math.PI, end: 3 * Math.PI / 2 }, // Bottom left quarter (90°)
    'Mouth Feel': { start: 3 * Math.PI / 2, end: 2 * Math.PI } // Bottom right quarter (90°)
  };

  const createArcPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const x1 = center + innerRadius * Math.cos(startAngle);
    const y1 = center + innerRadius * Math.sin(startAngle);
    const x2 = center + outerRadius * Math.cos(startAngle);
    const y2 = center + outerRadius * Math.sin(startAngle);
    
    const x3 = center + outerRadius * Math.cos(endAngle);
    const y3 = center + outerRadius * Math.sin(endAngle);
    const x4 = center + innerRadius * Math.cos(endAngle);
    const y4 = center + innerRadius * Math.sin(endAngle);
    
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`;
  };

  const getLabelPosition = (angle: number, radius: number, fontSize: number, text: string) => {
    // Balanced base distance - enough clearance without going overboard
    const baseDistance = Math.max(20, size * 0.055);
    
    // Add a small extra buffer for longer words to prevent overlap
    let labelDistance = baseDistance;
    if (text.length > 8) { // Only for very long words like "Chocolate"
      labelDistance += 5; // Just a small bump, not a rocket launch
    }
    
    // Calculate position
    const x = center + (radius + labelDistance) * Math.cos(angle);
    const y = center + (radius + labelDistance) * Math.sin(angle);
    
    // Gentle boundary constraints - allow some breathing room but don't be too restrictive
    const padding = fontSize; // Use font size as padding for proportional spacing
    const maxX = size - padding;
    const minX = padding;
    const maxY = size - padding;
    const minY = padding;
    
    const clampedX = Math.max(minX, Math.min(maxX, x));
    const clampedY = Math.max(minY, Math.min(maxY, y));
    
    // Fine-tune vertical positioning for SVG text baseline
    const verticalAdjustment = fontSize * 0.35;
    
    return { 
      x: clampedX, 
      y: clampedY + verticalAdjustment 
    };
  };

  // Function to determine which ring was tapped based on distance from center
    const getRingFromDistance = (distance: number, radius: number): number => {
      if (distance < radius * 0.35) return 0; // Inside hollow center
      if (distance < radius * 0.58) return 1; // Ring 1
      if (distance < radius * 0.81) return 2; // Ring 2
      if (distance < radius) return 3;        // Ring 3
      return 0; // Outside wheel
    };  // Function to determine which taste segment was tapped based on angle
  const getTasteFromAngle = (angle: number): string | null => {
    // Normalize angle to 0-2π range
    const normalizedAngle = ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    
    for (const [categoryName, angles] of Object.entries(categoryAngles)) {
      if (normalizedAngle >= angles.start && normalizedAngle < angles.end) {
        const categoryTastes = tasteCategories[categoryName as keyof typeof tasteCategories];
        const anglePerTaste = (angles.end - angles.start) / categoryTastes.length;
        const tasteIndex = Math.floor((normalizedAngle - angles.start) / anglePerTaste);
        return categoryTastes[tasteIndex] || null;
      }
    }
    return null;
  };

  // Handle tap on the wheel (only if interactive)
  const handleWheelTap = (event: any) => {
    if (!onTasteRatingChange) return; // Not interactive
    
    const { locationX, locationY } = event.nativeEvent;
    
    // Calculate distance from center
    const dx = locationX - center;
    const dy = locationY - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate angle
    const angle = Math.atan2(dy, dx);
    
    // Determine which ring and taste were tapped
    const ring = getRingFromDistance(distance, radius);
    const taste = getTasteFromAngle(angle);
    
    if (ring > 0 && taste) {
      const currentRating = tasteRating[taste] || 0;
      
      // If tapping the same ring that's already selected, reset to 0
      // Otherwise, set to the tapped ring value
      const newRating = currentRating === ring ? 0 : ring;
      
      onTasteRatingChange(taste, newRating);
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} onPress={onTasteRatingChange ? handleWheelTap : undefined}>
        {/* Draw complete concentric circles first */}
        {/* Center hollow circle - new design (transparent/hollow) */}
        <Circle
          cx={center}
          cy={center}
          r={radius * 0.35}
          fill="none"
          stroke="#fff"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius * 0.58}
          fill="none"
          stroke="#fff"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius * 0.81}
          fill="none"
          stroke="#fff"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#fff"
          strokeWidth={strokeWidth}
        />

        {/* Draw each main category */}
        {Object.entries(categoryAngles).map(([categoryName, angles]) => {
          const categoryTastes = tasteCategories[categoryName as keyof typeof tasteCategories];
          const anglePerTaste = (angles.end - angles.start) / categoryTastes.length;
          
          return (
            <G key={categoryName}>
              {/* Individual taste segments */}
              {categoryTastes.map((taste, index) => {
                const tasteStartAngle = angles.start + index * anglePerTaste;
                const tasteEndAngle = angles.start + (index + 1) * anglePerTaste;
                const midAngle = tasteStartAngle + anglePerTaste / 2;
                const rating = tasteRating[taste] || 0;
                
                return (
                  <G key={taste}>
                    {/* Ring 1 (35% - 58%) - Inner ring */}
                    <Path
                      d={createArcPath(tasteStartAngle, tasteEndAngle, radius * 0.35, radius * 0.58)}
                      fill={rating >= 1 ? accentColor : transparentColor}
                      opacity={rating >= 1 ? 1 : 0}
                      stroke="none"
                    />
                    
                    {/* Ring 2 (58% - 81%) - Middle ring */}
                    <Path
                      d={createArcPath(tasteStartAngle, tasteEndAngle, radius * 0.58, radius * 0.81)}
                      fill={rating >= 2 ? accentColor : transparentColor}
                      opacity={rating >= 2 ? 1 : 0}
                      stroke="none"
                    />
                    
                    {/* Ring 3 (81% - 100%) - Outer ring */}
                    <Path
                      d={createArcPath(tasteStartAngle, tasteEndAngle, radius * 0.81, radius)}
                      fill={rating >= 3 ? accentColor : transparentColor}
                      opacity={rating >= 3 ? 1 : 0}
                      stroke="none"
                    />
                    
                    {/* Taste label - show for ALL tastes, keep all white */}
                    {(() => {
                      const labelDistance = radius + Math.max(20, size * 0.04); // This will be overridden by getLabelPosition
                      const baseFontSize = Math.max(10, size * 0.035); // Scale font size with component size
                      const fontSize = categoryTastes.length > 6 ? baseFontSize * 0.9 : baseFontSize; // Slightly smaller for crowded categories
                      const labelPos = getLabelPosition(midAngle, radius, fontSize, taste);
                      return (
                        <SvgText
                          x={labelPos.x}
                          y={labelPos.y}
                          fontSize={fontSize}
                          fill="#fff" // Keep all text white
                          textAnchor="middle"
                          fontWeight="500"
                          fontFamily="cardRegular"
                        >
                          {taste.trim()}
                        </SvgText>
                      );
                    })()}

                    {/* Divider lines between taste segments within each category */}
                    {index > 0 && (
                      <Path
                        d={`M ${center + radius * 0.35 * Math.cos(tasteStartAngle)} ${center + radius * 0.35 * Math.sin(tasteStartAngle)} L ${center + radius * Math.cos(tasteStartAngle)} ${center + radius * Math.sin(tasteStartAngle)}`}
                        stroke="#fff"
                        strokeWidth={strokeWidth}
                        opacity={0.8}
                      />
                    )}
                  </G>
                );
              })}
            </G>
          );
        })}

        {/* Divider lines between main categories */}
        {Object.values(categoryAngles).map((angles, index) => (
          <G key={`divider-${index}`}>
            <Path
              d={`M ${center + radius * 0.35 * Math.cos(angles.start)} ${center + radius * 0.35 * Math.sin(angles.start)} L ${center + radius * Math.cos(angles.start)} ${center + radius * Math.sin(angles.start)}`}
              stroke="#fff"
              strokeWidth={strokeWidth}
              opacity={0.9}
            />
          </G>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // Center the wheel horizontally
  },
});

export default TastingWheel;
