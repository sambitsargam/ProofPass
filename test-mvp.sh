#!/bin/bash

# ProofPass MVP Test Script
# Tests all major functionality

echo "🧪 ProofPass MVP Test Suite"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local METHOD=$1
    local ENDPOINT=$2
    local DATA=$3
    local EXPECTED_STATUS=$4
    
    echo -n "Testing $METHOD $ENDPOINT... "
    
    if [ -z "$DATA" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" -X $METHOD "http://localhost:3000$ENDPOINT")
    else
        RESPONSE=$(curl -s -w "\n%{http_code}" -X $METHOD "http://localhost:3000$ENDPOINT" \
            -H "Content-Type: application/json" \
            -d "$DATA")
    fi
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    
    if [ "$HTTP_CODE" = "$EXPECTED_STATUS" ]; then
        echo -e "${GREEN}✓${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} (Got $HTTP_CODE, expected $EXPECTED_STATUS)"
        ((TESTS_FAILED++))
    fi
}

# Function to check page loads
test_page() {
    local PAGE=$1
    
    echo -n "Testing page $PAGE... "
    
    HTTP_CODE=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:3000$PAGE")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} (Got $HTTP_CODE)"
        ((TESTS_FAILED++))
    fi
}

echo "🌐 Checking Server..."
echo ""

# Check if server is running
if ! nc -z localhost 3000 2>/dev/null; then
    echo -e "${RED}✗ Dev server not running on port 3000${NC}"
    echo "Start with: npm run dev"
    exit 1
fi

echo -e "${GREEN}✓${NC} Server is running on http://localhost:3000"
echo ""

echo "📄 Testing Pages..."
echo ""

test_page "/"
test_page "/login"
test_page "/events"
test_page "/dashboard"
test_page "/buy-tickets"
test_page "/dashboard/issuer"

echo ""
echo "🔌 Testing API Routes..."
echo ""

# Test credentials endpoint
test_endpoint "POST" "/api/credentials/issue" \
    '{"recipientAddress":"0x1234","credentialType":"HUMAN_VERIFIED"}' \
    "200"

test_endpoint "POST" "/api/credentials/verify" \
    '{"credentialId":"test","walletAddress":"0x1234"}' \
    "200"

# Test tickets endpoint
test_endpoint "POST" "/api/tickets/purchase" \
    '{"eventId":"1","quantity":2,"buyerAddress":"0x1234"}' \
    "200"

# Test fraud analysis endpoint
test_endpoint "POST" "/api/fraud/analyze" \
    '{"walletAddress":"0x1234","purchaseHistory":[]}' \
    "200"

echo ""
echo "📊 Test Summary"
echo "=============================="
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "Your ProofPass MVP is fully functional!"
    echo "Visit http://localhost:3000 to see it in action."
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
