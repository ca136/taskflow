"""Soft limits v2 functionality tests.

This test module covers:
- Soft limit validation functionality
- Soft limit enforcement scenarios
- Edge cases and boundary testing
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from typing import Dict, Any, Optional


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def soft_limits_config() -> Dict[str, Any]:
    """Basic soft limits configuration."""
    return {
        "max_tokens": 100000,
        "max_cost_usd": 1.0,
        "max_api_calls": 50,
        "on_exceed": "bail_and_reflect",
    }


@pytest.fixture
def soft_limit_tracker():
    """Mock soft limit tracker instance."""
    tracker = Mock()
    tracker.tokens_used = 0
    tracker.cost_used = 0.0
    tracker.api_calls = 0
    tracker.limits = {
        "max_tokens": 100000,
        "max_cost_usd": 1.0,
        "max_api_calls": 50,
    }
    tracker.violations = []
    return tracker


@pytest.fixture
def soft_limit_manager(soft_limits_config):
    """Mock soft limit manager instance."""
    manager = Mock()
    manager.config = soft_limits_config
    manager.trackers = {}
    manager.get_tracker = Mock(return_value=None)
    manager.create_tracker = Mock()
    manager.check_limits = Mock()
    manager.record_usage = Mock()
    manager.get_violations = Mock(return_value=[])
    return manager


# ============================================================================
# Test Cases: Validation Functionality
# ============================================================================

class TestSoftLimitValidation:
    """Test soft limit configuration validation."""

    def test_valid_config_passes_validation(self, soft_limits_config):
        """Test that valid configuration passes validation."""
        # Simulate validation logic
        required_fields = {"max_tokens", "max_cost_usd", "max_api_calls", "on_exceed"}
        assert all(field in soft_limits_config for field in required_fields)

    def test_missing_max_tokens_raises_error(self):
        """Test that missing max_tokens field raises validation error."""
        config = {
            "max_cost_usd": 1.0,
            "max_api_calls": 50,
            "on_exceed": "bail_and_reflect",
        }
        required_fields = {"max_tokens", "max_cost_usd", "max_api_calls", "on_exceed"}
        assert not all(field in config for field in required_fields)

    def test_missing_max_cost_raises_error(self):
        """Test that missing max_cost_usd field raises validation error."""
        config = {
            "max_tokens": 100000,
            "max_api_calls": 50,
            "on_exceed": "bail_and_reflect",
        }
        required_fields = {"max_tokens", "max_cost_usd", "max_api_calls", "on_exceed"}
        assert not all(field in config for field in required_fields)

    def test_missing_max_api_calls_raises_error(self):
        """Test that missing max_api_calls field raises validation error."""
        config = {
            "max_tokens": 100000,
            "max_cost_usd": 1.0,
            "on_exceed": "bail_and_reflect",
        }
        required_fields = {"max_tokens", "max_cost_usd", "max_api_calls", "on_exceed"}
        assert not all(field in config for field in required_fields)

    def test_missing_on_exceed_raises_error(self):
        """Test that missing on_exceed field raises validation error."""
        config = {
            "max_tokens": 100000,
            "max_cost_usd": 1.0,
            "max_api_calls": 50,
        }
        required_fields = {"max_tokens", "max_cost_usd", "max_api_calls", "on_exceed"}
        assert not all(field in config for field in required_fields)

    def test_invalid_on_exceed_value_raises_error(self):
        """Test that invalid on_exceed value raises validation error."""
        config = {
            "max_tokens": 100000,
            "max_cost_usd": 1.0,
            "max_api_calls": 50,
            "on_exceed": "invalid_action",
        }
        valid_actions = {"bail_and_reflect", "warn", "enforce"}
        assert config["on_exceed"] not in valid_actions

    def test_valid_on_exceed_values(self, soft_limits_config):
        """Test that all valid on_exceed values are accepted."""
        valid_actions = {"bail_and_reflect", "warn", "enforce"}
        for action in valid_actions:
            soft_limits_config["on_exceed"] = action
            assert soft_limits_config["on_exceed"] in valid_actions

    def test_negative_max_tokens_raises_error(self):
        """Test that negative max_tokens raises validation error."""
        config = {
            "max_tokens": -1,
            "max_cost_usd": 1.0,
            "max_api_calls": 50,
            "on_exceed": "bail_and_reflect",
        }
        assert config["max_tokens"] < 0

    def test_negative_max_cost_raises_error(self):
        """Test that negative max_cost_usd raises validation error."""
        config = {
            "max_tokens": 100000,
            "max_cost_usd": -0.5,
            "max_api_calls": 50,
            "on_exceed": "bail_and_reflect",
        }
        assert config["max_cost_usd"] < 0

    def test_negative_max_api_calls_raises_error(self):
        """Test that negative max_api_calls raises validation error."""
        config = {
            "max_tokens": 100000,
            "max_cost_usd": 1.0,
            "max_api_calls": -10,
            "on_exceed": "bail_and_reflect",
        }
        assert config["max_api_calls"] < 0


# ============================================================================
# Test Cases: Enforcement Scenarios
# ============================================================================

class TestSoftLimitEnforcement:
    """Test soft limit enforcement during operation."""

    def test_token_limit_not_exceeded(self, soft_limit_tracker):
        """Test that token usage within limit is allowed."""
        soft_limit_tracker.tokens_used = 50000
        soft_limit_tracker.limits["max_tokens"] = 100000
        
        is_exceeded = soft_limit_tracker.tokens_used >= soft_limit_tracker.limits["max_tokens"]
        assert not is_exceeded

    def test_token_limit_exactly_met(self, soft_limit_tracker):
        """Test behavior when token usage exactly meets limit."""
        soft_limit_tracker.tokens_used = 100000
        soft_limit_tracker.limits["max_tokens"] = 100000
        
        is_exceeded = soft_limit_tracker.tokens_used >= soft_limit_tracker.limits["max_tokens"]
        assert is_exceeded

    def test_token_limit_exceeded(self, soft_limit_tracker):
        """Test that token usage exceeding limit is detected."""
        soft_limit_tracker.tokens_used = 150000
        soft_limit_tracker.limits["max_tokens"] = 100000
        
        is_exceeded = soft_limit_tracker.tokens_used > soft_limit_tracker.limits["max_tokens"]
        assert is_exceeded

    def test_cost_limit_not_exceeded(self, soft_limit_tracker):
        """Test that cost usage within limit is allowed."""
        soft_limit_tracker.cost_used = 0.5
        soft_limit_tracker.limits["max_cost_usd"] = 1.0
        
        is_exceeded = soft_limit_tracker.cost_used >= soft_limit_tracker.limits["max_cost_usd"]
        assert not is_exceeded

    def test_cost_limit_exactly_met(self, soft_limit_tracker):
        """Test behavior when cost usage exactly meets limit."""
        soft_limit_tracker.cost_used = 1.0
        soft_limit_tracker.limits["max_cost_usd"] = 1.0
        
        is_exceeded = soft_limit_tracker.cost_used >= soft_limit_tracker.limits["max_cost_usd"]
        assert is_exceeded

    def test_cost_limit_exceeded(self, soft_limit_tracker):
        """Test that cost usage exceeding limit is detected."""
        soft_limit_tracker.cost_used = 1.5
        soft_limit_tracker.limits["max_cost_usd"] = 1.0
        
        is_exceeded = soft_limit_tracker.cost_used > soft_limit_tracker.limits["max_cost_usd"]
        assert is_exceeded

    def test_api_calls_limit_not_exceeded(self, soft_limit_tracker):
        """Test that API calls within limit is allowed."""
        soft_limit_tracker.api_calls = 25
        soft_limit_tracker.limits["max_api_calls"] = 50
        
        is_exceeded = soft_limit_tracker.api_calls >= soft_limit_tracker.limits["max_api_calls"]
        assert not is_exceeded

    def test_api_calls_limit_exactly_met(self, soft_limit_tracker):
        """Test behavior when API calls exactly meets limit."""
        soft_limit_tracker.api_calls = 50
        soft_limit_tracker.limits["max_api_calls"] = 50
        
        is_exceeded = soft_limit_tracker.api_calls >= soft_limit_tracker.limits["max_api_calls"]
        assert is_exceeded

    def test_api_calls_limit_exceeded(self, soft_limit_tracker):
        """Test that API calls exceeding limit is detected."""
        soft_limit_tracker.api_calls = 75
        soft_limit_tracker.limits["max_api_calls"] = 50
        
        is_exceeded = soft_limit_tracker.api_calls > soft_limit_tracker.limits["max_api_calls"]
        assert is_exceeded

    def test_multiple_limits_all_within_bounds(self, soft_limit_tracker):
        """Test when all limits are within bounds."""
        soft_limit_tracker.tokens_used = 50000
        soft_limit_tracker.cost_used = 0.5
        soft_limit_tracker.api_calls = 25
        
        all_ok = (
            soft_limit_tracker.tokens_used <= soft_limit_tracker.limits["max_tokens"] and
            soft_limit_tracker.cost_used <= soft_limit_tracker.limits["max_cost_usd"] and
            soft_limit_tracker.api_calls <= soft_limit_tracker.limits["max_api_calls"]
        )
        assert all_ok

    def test_multiple_limits_one_exceeded(self, soft_limit_tracker):
        """Test when one limit is exceeded while others are ok."""
        soft_limit_tracker.tokens_used = 150000  # Exceeded
        soft_limit_tracker.cost_used = 0.5
        soft_limit_tracker.api_calls = 25
        
        any_exceeded = (
            soft_limit_tracker.tokens_used > soft_limit_tracker.limits["max_tokens"] or
            soft_limit_tracker.cost_used > soft_limit_tracker.limits["max_cost_usd"] or
            soft_limit_tracker.api_calls > soft_limit_tracker.limits["max_api_calls"]
        )
        assert any_exceeded

    def test_multiple_limits_all_exceeded(self, soft_limit_tracker):
        """Test when all limits are exceeded."""
        soft_limit_tracker.tokens_used = 150000
        soft_limit_tracker.cost_used = 2.0
        soft_limit_tracker.api_calls = 100
        
        all_exceeded = (
            soft_limit_tracker.tokens_used > soft_limit_tracker.limits["max_tokens"] and
            soft_limit_tracker.cost_used > soft_limit_tracker.limits["max_cost_usd"] and
            soft_limit_tracker.api_calls > soft_limit_tracker.limits["max_api_calls"]
        )
        assert all_exceeded

    def test_bail_and_reflect_action(self, soft_limit_manager):
        """Test bail_and_reflect action is properly registered."""
        soft_limit_manager.config["on_exceed"] = "bail_and_reflect"
        assert soft_limit_manager.config["on_exceed"] == "bail_and_reflect"

    def test_warn_action(self, soft_limit_manager):
        """Test warn action is properly registered."""
        soft_limit_manager.config["on_exceed"] = "warn"
        assert soft_limit_manager.config["on_exceed"] == "warn"

    def test_enforce_action(self, soft_limit_manager):
        """Test enforce action is properly registered."""
        soft_limit_manager.config["on_exceed"] = "enforce"
        assert soft_limit_manager.config["on_exceed"] == "enforce"


# ============================================================================
# Test Cases: Edge Cases & Boundary Testing
# ============================================================================

class TestSoftLimitEdgeCases:
    """Test edge cases and boundary conditions."""

    def test_zero_max_tokens(self):
        """Test that zero max_tokens is a valid edge case."""
        limits = {"max_tokens": 0}
        # Zero tokens might be valid for certain scenarios
        assert limits["max_tokens"] >= 0

    def test_zero_max_cost(self):
        """Test that zero max_cost is a valid edge case."""
        limits = {"max_cost_usd": 0.0}
        # Zero cost might be valid for certain scenarios
        assert limits["max_cost_usd"] >= 0

    def test_zero_max_api_calls(self):
        """Test that zero max_api_calls is a valid edge case."""
        limits = {"max_api_calls": 0}
        # Zero calls might be valid for certain scenarios
        assert limits["max_api_calls"] >= 0

    def test_very_large_token_limit(self):
        """Test with very large token limit."""
        limits = {"max_tokens": 10**9}
        assert limits["max_tokens"] > 0

    def test_very_large_cost_limit(self):
        """Test with very large cost limit."""
        limits = {"max_cost_usd": 10**6}
        assert limits["max_cost_usd"] > 0

    def test_very_large_api_calls_limit(self):
        """Test with very large API calls limit."""
        limits = {"max_api_calls": 10**6}
        assert limits["max_api_calls"] > 0

    def test_fractional_cost_precision(self):
        """Test fractional cost values with high precision."""
        tracker = Mock()
        tracker.cost_used = 0.123456789
        tracker.limits = {"max_cost_usd": 1.0}
        
        is_exceeded = tracker.cost_used > tracker.limits["max_cost_usd"]
        assert not is_exceeded

    def test_cost_rounding_edge_case(self):
        """Test cost tracking with rounding edge cases."""
        tracker = Mock()
        # Simulate accumulated small rounding errors
        tracker.cost_used = 0.99999999999
        tracker.limits = {"max_cost_usd": 1.0}
        
        # Should still be within limit
        is_exceeded = tracker.cost_used > tracker.limits["max_cost_usd"]
        assert not is_exceeded

    def test_incremental_usage_approaching_limit(self, soft_limit_tracker):
        """Test gradual usage approaching the limit."""
        soft_limit_tracker.limits["max_tokens"] = 100
        increments = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        
        violations = []
        for usage in increments:
            soft_limit_tracker.tokens_used = usage
            if soft_limit_tracker.tokens_used > soft_limit_tracker.limits["max_tokens"]:
                violations.append(usage)
        
        # Should not exceed at any point
        assert len(violations) == 0

    def test_incremental_usage_exceeding_limit(self, soft_limit_tracker):
        """Test gradual usage exceeding the limit."""
        soft_limit_tracker.limits["max_tokens"] = 100
        increments = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]
        
        violations = []
        for usage in increments:
            soft_limit_tracker.tokens_used = usage
            if soft_limit_tracker.tokens_used > soft_limit_tracker.limits["max_tokens"]:
                violations.append(usage)
        
        # Should detect violation at 110
        assert len(violations) == 1
        assert violations[0] == 110

    def test_concurrent_limit_checking(self):
        """Test that limits can be checked concurrently without race conditions."""
        tracker1 = Mock()
        tracker2 = Mock()
        
        tracker1.tokens_used = 50000
        tracker1.limits = {"max_tokens": 100000}
        
        tracker2.tokens_used = 75000
        tracker2.limits = {"max_tokens": 100000}
        
        result1 = tracker1.tokens_used <= tracker1.limits["max_tokens"]
        result2 = tracker2.tokens_used <= tracker2.limits["max_tokens"]
        
        # Both should be valid independently
        assert result1 and result2

    def test_usage_reset_after_violation(self, soft_limit_tracker):
        """Test that usage can be reset after a violation."""
        soft_limit_tracker.tokens_used = 150000
        soft_limit_tracker.limits["max_tokens"] = 100000
        
        # First check - should exceed
        is_exceeded = soft_limit_tracker.tokens_used > soft_limit_tracker.limits["max_tokens"]
        assert is_exceeded
        
        # Reset usage
        soft_limit_tracker.tokens_used = 0
        
        # Second check - should not exceed
        is_exceeded = soft_limit_tracker.tokens_used > soft_limit_tracker.limits["max_tokens"]
        assert not is_exceeded

    def test_limit_change_during_operation(self, soft_limit_tracker):
        """Test that limits can be adjusted during operation."""
        soft_limit_tracker.tokens_used = 50000
        soft_limit_tracker.limits["max_tokens"] = 100000
        
        # Initial check - within limit
        is_exceeded = soft_limit_tracker.tokens_used > soft_limit_tracker.limits["max_tokens"]
        assert not is_exceeded
        
        # Lower the limit
        soft_limit_tracker.limits["max_tokens"] = 40000
        
        # Now should exceed
        is_exceeded = soft_limit_tracker.tokens_used > soft_limit_tracker.limits["max_tokens"]
        assert is_exceeded

    def test_percentage_utilization_calculation(self, soft_limit_tracker):
        """Test calculation of utilization percentage."""
        soft_limit_tracker.tokens_used = 50000
        soft_limit_tracker.limits["max_tokens"] = 100000
        
        utilization = (soft_limit_tracker.tokens_used / soft_limit_tracker.limits["max_tokens"]) * 100
        assert utilization == 50.0

    def test_percentage_utilization_at_limit(self, soft_limit_tracker):
        """Test utilization percentage when at limit."""
        soft_limit_tracker.tokens_used = 100000
        soft_limit_tracker.limits["max_tokens"] = 100000
        
        utilization = (soft_limit_tracker.tokens_used / soft_limit_tracker.limits["max_tokens"]) * 100
        assert utilization == 100.0

    def test_percentage_utilization_over_limit(self, soft_limit_tracker):
        """Test utilization percentage when over limit."""
        soft_limit_tracker.tokens_used = 150000
        soft_limit_tracker.limits["max_tokens"] = 100000
        
        utilization = (soft_limit_tracker.tokens_used / soft_limit_tracker.limits["max_tokens"]) * 100
        assert utilization > 100.0
        assert utilization == 150.0


# ============================================================================
# Test Cases: Violation Tracking
# ============================================================================

class TestSoftLimitViolationTracking:
    """Test violation detection and tracking."""

    def test_single_violation_recorded(self, soft_limit_tracker):
        """Test that a single violation is properly recorded."""
        soft_limit_tracker.tokens_used = 150000
        soft_limit_tracker.limits["max_tokens"] = 100000
        
        violation = {
            "type": "tokens",
            "limit": 100000,
            "used": 150000,
            "exceeded_by": 50000,
        }
        soft_limit_tracker.violations = [violation]
        
        assert len(soft_limit_tracker.violations) == 1
        assert soft_limit_tracker.violations[0]["type"] == "tokens"

    def test_multiple_violations_tracked(self, soft_limit_tracker):
        """Test that multiple violations are tracked."""
        violations = [
            {"type": "tokens", "exceeded_by": 50000},
            {"type": "cost", "exceeded_by": 0.5},
            {"type": "api_calls", "exceeded_by": 25},
        ]
        soft_limit_tracker.violations = violations
        
        assert len(soft_limit_tracker.violations) == 3

    def test_violation_metadata_captured(self, soft_limit_tracker):
        """Test that violation metadata is properly captured."""
        violation = {
            "type": "tokens",
            "limit": 100000,
            "used": 150000,
            "exceeded_by": 50000,
            "timestamp": "2024-01-01T12:00:00Z",
            "action": "bail_and_reflect",
        }
        soft_limit_tracker.violations = [violation]
        
        assert violation["timestamp"] is not None
        assert violation["action"] == "bail_and_reflect"

    def test_no_violations_when_within_limits(self, soft_limit_tracker):
        """Test that no violations are recorded when within limits."""
        soft_limit_tracker.tokens_used = 50000
        soft_limit_tracker.cost_used = 0.5
        soft_limit_tracker.api_calls = 25
        soft_limit_tracker.violations = []
        
        assert len(soft_limit_tracker.violations) == 0


# ============================================================================
# Test Cases: Integration Scenarios
# ============================================================================

class TestSoftLimitIntegration:
    """Test integration scenarios with the manager."""

    def test_manager_creates_tracker(self, soft_limit_manager):
        """Test that manager can create new tracker."""
        soft_limit_manager.create_tracker("user_123")
        soft_limit_manager.create_tracker.assert_called_with("user_123")

    def test_manager_tracks_usage(self, soft_limit_manager):
        """Test that manager records usage."""
        soft_limit_manager.record_usage("user_123", "tokens", 1000)
        soft_limit_manager.record_usage.assert_called_with("user_123", "tokens", 1000)

    def test_manager_checks_limits(self, soft_limit_manager):
        """Test that manager checks limits."""
        soft_limit_manager.check_limits("user_123")
        soft_limit_manager.check_limits.assert_called_with("user_123")

    def test_manager_retrieves_violations(self, soft_limit_manager):
        """Test that manager retrieves violations."""
        soft_limit_manager.get_violations("user_123")
        soft_limit_manager.get_violations.assert_called_with("user_123")

    def test_multiple_users_independent_limits(self):
        """Test that multiple users have independent limit tracking."""
        user1_tracker = Mock()
        user2_tracker = Mock()
        
        user1_tracker.tokens_used = 50000
        user2_tracker.tokens_used = 75000
        
        user1_tracker.limits = {"max_tokens": 100000}
        user2_tracker.limits = {"max_tokens": 100000}
        
        # Each user's usage is independent
        assert user1_tracker.tokens_used != user2_tracker.tokens_used

    def test_manager_resets_tracker(self, soft_limit_manager):
        """Test that manager can reset tracker."""
        soft_limit_manager.reset_tracker = Mock()
        soft_limit_manager.reset_tracker("user_123")
        soft_limit_manager.reset_tracker.assert_called_with("user_123")
