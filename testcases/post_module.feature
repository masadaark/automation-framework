@post_module
Feature: POST_MODULE
    @regression-test @full-regression-test
    Scenario:TearDown
        Given Exec sql: "reset_db"
    @regression-test @full-regression-test
    Scenario: POST_MODULE สำเร็จ
        Given Feature "post_product_module" tcNo.1
        Given Http Request api:"login"
        Given Collect Response Path:"." Var:"jwtToken"
        Given Http "POST" "/api/tms/products"
            | tcNo | headers                                | name    | description |
            | 1    | {"Authorization": "Bearer {jwtToken}"} | product | test        |
        Given Collect Response Path:".id" Var:"productId"
        Given Http "POST" "/api/tms/products/1/modules"
            | tcNo | headers                                | name   | description |
            | 1    | {"Authorization": "Bearer {jwtToken}"} | module | test        |
        When "expect_achive" Postgres query
        # Then Expecting jsonArray query result
    @regression-test @full-regression-test
    Scenario Outline: POST_MODULE กรณีมีตัวพิมพ์ใหญ่
        Given Feature "post_product_module" tcNo.1
        Given Http "POST" "/api/tms/products/1/modules"
            | tcNo | headers                                | name    |
            | 1    | {"Authorization": "Bearer {jwtToken}"} | ModuLe2 |
        When "expect_lower_name" Postgres query
        # Then Expecting jsonArray query result
    @regression-test @full-regression-test
    Scenario Outline: POST_MODULE ยิงไม่สำเร็จ-<tcName>
        Given Feature "post_product_module" tcNo.<tcNo>
        Given "post_module_validation" Http Request
        Then Expecting Http response subset
        Examples:
            | tcNo | tcName                                        |
            | 4    | กรณีระบุ type ผิด                             |
            | 5    | กรณีระบุชื่อซ้ำ                               |
            | 6    | กรณีที่ไม่ระบุ Authorization                  |
            | 7    | กรณีไม่ระบุสิ่งที่จะ Post                     |
            | 8    | กรรีระบุแค่ description                       |
            | 9    | กรณีชื่อต่างกันที่ตัวพิมพ์เล็กและตัวพิมพ์ใหญ่ |

    # @regression-test @full-regression-test
    # Scenario Outline: PATCH_FEATURE check transaction_code_id
    #     Given Feature "check_transaction_code_id" tcNo.<tcNo>
    #     Given Http Request api:"login"
    #     Given Collect Response Path:"." Var:"jwtToken"
    #     Given Set Num Var "id":"<id>"
    #     Given Set Num Var "transaction_code_id":"<transaction_code_id>"
    #     When "check_transaction_code_id" Postgres query
    #     Then Expecting jsonArray query result
    #     Examples:
    #         | tcNo | tcName                    | id | transaction_code_id |
    #         | 1    | check_transaction_code_id | 3  | 2                   |
    @regression-test @full-regression-test
    Scenario:TearDown
        Given Exec sql: "reset_db"