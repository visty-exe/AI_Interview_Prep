import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-neutral-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl mx-auto">
        {/* Top wordmark */}
        <div className="flex items-center justify-between mb-16">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-neutral-900"
          >
            HireMate
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            <Compass size={14} strokeWidth={1.8} />
            Error 404
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Animated SVG */}
          <div className="order-2 lg:order-1">
            <div className="relative w-full aspect-square max-w-[420px] mx-auto">
              <svg
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                aria-label="404 page illustration"
                role="img"
              >
                <style>
                  {`
                    .orbit {
                      transform-origin: 250px 250px;
                      animation: rotate 18s linear infinite;
                    }

                    .orbit-reverse {
                      transform-origin: 250px 250px;
                      animation: rotateReverse 24s linear infinite;
                    }

                    .float {
                      animation: float 4s ease-in-out infinite;
                    }

                    .float-delay {
                      animation: float 4s ease-in-out 1.2s infinite;
                    }

                    .pulse {
                      animation: pulse 2.5s ease-in-out infinite;
                    }

                    .dash {
                      stroke-dasharray: 8 12;
                      animation: dash 3s linear infinite;
                    }

                    @keyframes rotate {
                      from {
                        transform: rotate(0deg);
                      }
                      to {
                        transform: rotate(360deg);
                      }
                    }

                    @keyframes rotateReverse {
                      from {
                        transform: rotate(360deg);
                      }
                      to {
                        transform: rotate(0deg);
                      }
                    }

                    @keyframes float {
                      0%, 100% {
                        transform: translateY(0);
                      }
                      50% {
                        transform: translateY(-10px);
                      }
                    }

                    @keyframes pulse {
                      0%, 100% {
                        opacity: 0.35;
                        transform: scale(1);
                      }
                      50% {
                        opacity: 0.7;
                        transform: scale(1.08);
                      }
                    }

                    @keyframes dash {
                      to {
                        stroke-dashoffset: -40;
                      }
                    }

                    @media (prefers-reduced-motion: reduce) {
                      .orbit,
                      .orbit-reverse,
                      .float,
                      .float-delay,
                      .pulse,
                      .dash {
                        animation: none;
                      }
                    }
                  `}
                </style>

                {/* Outer orbit */}
                <g className="orbit">
                  <circle
                    cx="250"
                    cy="250"
                    r="190"
                    stroke="#e5e5e5"
                    strokeWidth="1"
                  />

                  <circle
                    cx="250"
                    cy="60"
                    r="5"
                    fill="#171717"
                  />

                  <circle
                    cx="440"
                    cy="250"
                    r="3"
                    fill="#737373"
                  />
                </g>

                {/* Inner orbit */}
                <g className="orbit-reverse">
                  <circle
                    cx="250"
                    cy="250"
                    r="145"
                    stroke="#e5e5e5"
                    strokeWidth="1"
                    strokeDasharray="3 9"
                  />

                  <circle
                    cx="250"
                    cy="105"
                    r="3"
                    fill="#a3a3a3"
                  />
                </g>

                {/* Floating geometric elements */}
                <g className="float">
                  <rect
                    x="72"
                    y="148"
                    width="38"
                    height="38"
                    rx="8"
                    fill="white"
                    stroke="#e5e5e5"
                  />

                  <path
                    d="M84 167L91 174L99 159"
                    stroke="#171717"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                <g className="float-delay">
                  <rect
                    x="390"
                    y="330"
                    width="38"
                    height="38"
                    rx="8"
                    fill="white"
                    stroke="#e5e5e5"
                  />

                  <path
                    d="M402 342L416 356M416 342L402 356"
                    stroke="#737373"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </g>

                {/* Main 404 group */}
                <g className="pulse">
                  <text
                    x="250"
                    y="285"
                    textAnchor="middle"
                    fill="#171717"
                    fontSize="118"
                    fontWeight="700"
                    letterSpacing="-8"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    404
                  </text>
                </g>

                {/* Dashed connection */}
                <path
                  className="dash"
                  d="M110 380C165 335 190 350 250 350C310 350 335 335 390 380"
                  stroke="#d4d4d4"
                  strokeWidth="1"
                  strokeLinecap="round"
                />

                {/* Bottom marker */}
                <circle
                  cx="250"
                  cy="350"
                  r="5"
                  fill="#171717"
                />
              </svg>
            </div>
          </div>

          {/* Text content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              Page unavailable
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.05]">
              This page took a
              <br />
              wrong turn.
            </h1>

            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-neutral-600">
              The page you're looking for doesn't exist, has been moved, or
              the address may have been entered incorrectly.
            </p>

            {/* Divider */}
            <div className="h-px bg-neutral-200 my-8 max-w-md" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-neutral-900 text-white text-[13px] font-semibold hover:bg-neutral-800 transition-colors"
              >
                <ArrowLeft
                  size={14}
                  strokeWidth={1.8}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
                Back to Dashboard
              </Link>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-neutral-200 bg-white text-neutral-900 text-[13px] font-semibold hover:bg-neutral-50 transition-colors"
              >
                Go Back
                <ArrowRight
                  size={14}
                  strokeWidth={1.8}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </div>

            {/* Status */}
            <div className="mt-8 flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="font-mono">HTTP 404</span>
              <span>•</span>
              <span>Route not found</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-6 border-t border-neutral-200 flex items-center justify-between">
          <p className="text-[11px] text-neutral-400">
            HireMate · Interview preparation platform
          </p>

          <p className="text-[11px] font-mono text-neutral-400">
            404_NOT_FOUND
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;