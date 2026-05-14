/**
 * ProceduralGroundBackground
 * A WebGL 2D background featuring topographic neon lines and sand-ripple movement.
 * Optimized for performance using fragment shaders.
 * Vanilla JS version for non-React projects
 */

class ProceduralGroundBackground {
    constructor(canvasId = 'animated-bg-canvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        // Disable on mobile for better performance
        if (this.isMobileDevice()) {
            console.log('Animated background disabled on mobile for performance');
            this.canvas.style.display = 'none';
            return;
        }
        
        this.gl = this.canvas.getContext('webgl', { antialias: false, powerPreference: 'low-power' });
        if (!this.gl) {
            console.error('WebGL not supported');
            return;
        }
        
        this.animationFrameId = null;
        this.init();
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    init() {
        const gl = this.gl;
        
        // Vertex Shader
        const vsSource = `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;
        
        // Fragment Shader
        const fsSource = `
            precision highp float;
            uniform float u_time;
            uniform vec2 u_resolution;
            
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }
            
            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(
                    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), 
                    u.y
                );
            }
            
            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                
                // Ground Perspective Simulation
                float depth = 1.0 / (uv.y + 1.15);
                vec2 gridUv = vec2(uv.x * depth, depth + u_time * 0.15);
                
                // Layered Procedural Noise for Terrain
                float n = noise(gridUv * 3.5);
                float ripples = sin(gridUv.y * 18.0 + n * 8.0 + u_time * 0.5);
                
                // Neon Topographic Lines
                float topoLine = smoothstep(0.03, 0.0, abs(ripples));
                
                // Color Palette - Matching your portfolio theme
                vec3 baseColor = vec3(0.04, 0.05, 0.15);  // Deep navy (matching your dark theme)
                vec3 accentColor = vec3(0.0, 0.83, 1.0);  // Cyan blue (#00d4ff)
                vec3 neonColor = vec3(0.0, 1.0, 0.53);    // Neon green (#00ff88)
                
                // Composite
                vec3 finalColor = mix(baseColor, accentColor * 0.3, n * 0.6);
                finalColor += topoLine * neonColor * depth * 0.5;
                
                // Horizon Fog / Fade
                float fade = smoothstep(0.1, -1.0, uv.y);
                finalColor *= (1.0 - length(uv) * 0.35) * (1.0 - fade);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;
        
        // Create shaders
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        
        // Create program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        gl.useProgram(this.program);
        
        // Create buffer
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,  1, -1, -1,  1,
                -1,  1,  1, -1,  1,  1
            ]),
            gl.STATIC_DRAW
        );
        
        // Setup attributes
        const posAttrib = gl.getAttribLocation(this.program, "position");
        gl.enableVertexAttribArray(posAttrib);
        gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
        
        // Get uniform locations
        this.timeLoc = gl.getUniformLocation(this.program, "u_time");
        this.resLoc = gl.getUniformLocation(this.program, "u_resolution");
        
        // Handle resize
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
        
        // Start animation
        this.render(0);
    }
    
    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    handleResize() {
        const { innerWidth: width, innerHeight: height } = window;
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
    }
    
    render(time) {
        const gl = this.gl;
        
        gl.uniform1f(this.timeLoc, time * 0.001);
        gl.uniform2f(this.resLoc, this.canvas.width, this.canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        this.animationFrameId = requestAnimationFrame((t) => this.render(t));
    }
    
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.proceduralBg = new ProceduralGroundBackground();
    });
} else {
    window.proceduralBg = new ProceduralGroundBackground();
}
