const vertexShader = /* glsl */ `
uniform float uTime;

varying float vDistance;

vec3 spiralingNebula(vec3 position, float distanceFactor) {
return position + vec3(
cos(uTime * 2.0 + distanceFactor),
sin(uTime * 3.0 + distanceFactor),
cos(uTime * 4.0 + distanceFactor)
) * distanceFactor * 0.3;
}

void main() {
float radius = 2.0;
float distanceFactor = pow(radius - distance(position, vec3(0.0)), 2.0);
float size = distanceFactor * 10.0 + 10.0;

vec3 particlePosition = spiralingNebula(position, distanceFactor);

vDistance = distanceFactor;

vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
vec4 viewPosition = viewMatrix * modelPosition;
vec4 projectedPosition = projectionMatrix * viewPosition;

gl_Position = projectedPosition;

gl_PointSize = size;
gl_PointSize *= (1.0 / - viewPosition.z);
}
`;

export default vertexShader;
