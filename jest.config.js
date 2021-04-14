module.exports = {
    "transform": {
        "^.+\\.(t|j)sx?$": "ts-jest"
    },
    "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverage: true,
    collectCoverageFrom: ['src/ig-template/**/*.{js,jsx,ts}'],
    testMatch: ["<rootDir>/tests/**/*.{ts, js}"],
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1",
        "^lodash-es$": "lodash"
    }
}
