import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

interface TastingWheelProps {
  tasteRating: Record<string, number>;
  onTasteRatingChange?: (taste: string, rating: number) => void; // Optional - makes it interactive
}

const TastingWheel: React.FC<TastingWheelProps> = ({ tasteRating, onTasteRatingChange }) => {
  const screenWidth = Dimensions.get('window').width;
  const textPadding = 18; // Distance from wheel edge to text labels
  const sidePadding = textPadding; // Same padding on sides as text spacing
  const size = screenWidth - (2 * sidePadding); // Use consistent padding on both sides
  const center = size / 2;
  const radius = center - textPadding - 20; // Leave space for labels plus small margin
  
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

  const getLabelPosition = (angle: number, radius: number) => {
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  // Function to determine which ring was tapped based on distance from center
  const getRingFromDistance = (distance: number): number => {
    const ring1Radius = radius * 0.33;
    const ring2Radius = radius * 0.66;
    const ring3Radius = radius;

    if (distance <= ring1Radius) return 1;
    if (distance <= ring2Radius) return 2;
    if (distance <= ring3Radius) return 3;
    return 0; // Outside wheel
  };

  // Function to determine which taste segment was tapped based on angle
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
    const ring = getRingFromDistance(distance);
    const taste = getTasteFromAngle(angle);
    
    if (ring > 0 && taste) {
      onTasteRatingChange(taste, ring);
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} onPress={onTasteRatingChange ? handleWheelTap : undefined}>
        {/* Draw complete concentric circles first */}
        <Circle
          cx={center}
          cy={center}
          r={radius * 0.33}
          fill="none"
          stroke="#fff"
          strokeWidth="1"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius * 0.66}
          fill="none"
          stroke="#fff"
          strokeWidth="1"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#fff"
          strokeWidth="1"
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
                    {/* Ring 1 (0% - 33%) - Inner ring */}
                    <Path
                      d={createArcPath(tasteStartAngle, tasteEndAngle, 0, radius * 0.33)}
                      fill={rating >= 1 ? accentColor : transparentColor}
                      opacity={rating >= 1 ? 1 : 0}
                      stroke="none"
                    />
                    
                    {/* Ring 2 (33% - 66%) - Middle ring */}
                    <Path
                      d={createArcPath(tasteStartAngle, tasteEndAngle, radius * 0.33, radius * 0.66)}
                      fill={rating >= 2 ? accentColor : transparentColor}
                      opacity={rating >= 2 ? 1 : 0}
                      stroke="none"
                    />
                    
                    {/* Ring 3 (66% - 100%) - Outer ring */}
                    <Path
                      d={createArcPath(tasteStartAngle, tasteEndAngle, radius * 0.66, radius)}
                      fill={rating >= 3 ? accentColor : transparentColor}
                      opacity={rating >= 3 ? 1 : 0}
                      stroke="none"
                    />
                    
                    {/* Taste label - show for ALL tastes, keep all white */}
                    {(() => {
                      const labelPos = getLabelPosition(midAngle, radius + 18);
                      const fontSize = categoryTastes.length > 6 ? 9 : 10;
                      return (
                        <SvgText
                          x={labelPos.x}
                          y={labelPos.y}
                          fontSize={fontSize}
                          fill="#fff" // Keep all text white
                          textAnchor="middle"
                          fontWeight="500"
                        >
                          {taste}
                        </SvgText>
                      );
                    })()}

                    {/* Divider lines between taste segments within each category */}
                    {index > 0 && (
                      <Path
                        d={`M ${center} ${center} L ${center + radius * Math.cos(tasteStartAngle)} ${center + radius * Math.sin(tasteStartAngle)}`}
                        stroke="#fff"
                        strokeWidth="1"
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
              d={`M ${center} ${center} L ${center + radius * Math.cos(angles.start)} ${center + radius * Math.sin(angles.start)}`}
              stroke="#fff"
              strokeWidth="1"
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
    marginVertical: 20,
    alignSelf: 'center', // Center the wheel horizontally
  },
});

export default TastingWheel;
