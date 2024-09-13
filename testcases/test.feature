@regression-test
Feature: FEATURE
    Scenario: SCENARIO
        Given Feature "test" tcNo.1
        When "test.json" Http Request
        Then Expecting Http response subset
    Scenario: SCENARIO
        Given Feature "test" tcNo.1
        Given Http POST "/api/tms/products/1/modules"
            | tcNo | name  |
            | 1    | test  |
            | 1    | test2 |