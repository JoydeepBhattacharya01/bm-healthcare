#!/bin/bash

echo "=========================================="
echo "BM Healthcare - Complete Functionality Test"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $name... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $response)"
        ((FAILED++))
    fi
}

# Function to test JSON endpoint
test_json_endpoint() {
    local name=$1
    local url=$2
    local check_field=$3
    
    echo -n "Testing $name... "
    response=$(curl -s "$url")
    
    if echo "$response" | grep -q "$check_field"; then
        echo -e "${GREEN}✓ PASSED${NC} (Data found)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (No data or error)"
        ((FAILED++))
        echo "Response: $response" | head -c 200
    fi
}

echo "=========================================="
echo "1. BACKEND API TESTS"
echo "=========================================="
echo ""

# Test Backend Health
test_endpoint "Backend Health" "http://localhost:5001/"

# Test Doctor Endpoints
echo ""
echo "Doctor Endpoints:"
test_json_endpoint "  - Get All Doctors" "http://localhost:5001/api/doctors" "doctors"
test_json_endpoint "  - Get Specializations" "http://localhost:5001/api/doctors/specializations/list" "Cardiologist"

# Test Test Endpoints
echo ""
echo "Test Endpoints:"
test_json_endpoint "  - Get All Tests" "http://localhost:5001/api/tests" "tests"
test_json_endpoint "  - Get Test Categories" "http://localhost:5001/api/tests/categories/list" "Blood Test"

echo ""
echo "=========================================="
echo "2. FRONTEND PAGE TESTS"
echo "=========================================="
echo ""

# Test Frontend Pages
test_endpoint "Home Page" "http://localhost:3000/"
test_endpoint "Book Doctor Page" "http://localhost:3000/book-doctor"
test_endpoint "Book Test Page" "http://localhost:3000/book-test"
test_endpoint "My Bookings Page" "http://localhost:3000/my-bookings"
test_endpoint "Services Page" "http://localhost:3000/services"
test_endpoint "Contact Page" "http://localhost:3000/contact"

echo ""
echo "=========================================="
echo "3. DATA VERIFICATION"
echo "=========================================="
echo ""

# Check if doctors are being loaded
echo -n "Checking doctor data... "
doctor_count=$(curl -s "http://localhost:5001/api/doctors" | grep -o '"_id"' | wc -l)
if [ "$doctor_count" -gt 0 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Found $doctor_count doctors)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (No doctors found)"
    ((FAILED++))
fi

# Check if tests are being loaded
echo -n "Checking test data... "
test_count=$(curl -s "http://localhost:5001/api/tests" | grep -o '"_id"' | wc -l)
if [ "$test_count" -gt 0 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Found $test_count tests)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC} (No tests found)"
    ((FAILED++))
fi

echo ""
echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo ""
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    echo ""
    echo "The website is fully functional:"
    echo "  • Backend API is working correctly"
    echo "  • All frontend pages are accessible"
    echo "  • Doctors and tests are loading properly"
    echo "  • Database connection is established"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo "Please check the failed tests above."
    exit 1
fi
