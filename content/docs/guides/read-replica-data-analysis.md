---
title: Read replicas — Data analysis and reporting
subtitle: Leverage read replicas for running data-intensive queries
enableTableOfContents: true
updatedOn: '2023-09-11T10:04:29Z'
---

With Neon's read replica feature, you can instantly create a dedicated read-only compute instance for running data-intensive analytics or reporting queries. This allows you to avoid disruption or performance degradation on your production database.

A read replica reads data from the same source as your read-write compute instance. There's no data replication, so creating a read replica is a near-instant process. For more information about Neon's read replica architecture, see [Read replicas](/docs/introduction/read-replicas).

Suppose you have a `sales` table in your production database. The table and data might look something like this:

```sql
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    sale_amount DECIMAL(10,2) NOT NULL,
    sale_date DATE NOT NULL
);

INSERT INTO sales (product_id, sale_amount, sale_date) VALUES
(1, 20.50, '2022-07-24'),
(2, 35.99, '2022-08-24'),
(1, 20.50, '2022-09-24'),
(3, 15.00, '2023-01-24'),
(1, 20.50, '2023-04-24');
...
```

You want to find the total sale amount for each product in the past year, but due to the large number of products and sales in your database, you know it's a costly query that could impact performance on your production system.

This guide walks you through creating a read replica, connecting to it, running your query, and optionally deleting the read replica when finished.

## Create a read replica

Creating a read replica involves adding a read-only compute endpoint to a branch. You can add a read-only compute endpoint to any branch in your Neon project by following these steps:

1. In the Neon Console, select **Branches**.
2. Select the branch where your database resides.
3. Click **Add compute**.
4. On the **Create Compute Endpoint** dialog, select **Read-only** as the **Compute type**.
5. Specify the **Compute size** options. You can configure a **Fixed Size** compute with a specific amount of vCPU and RAM (the default) or enable **Autoscaling** and configure a minimum and maximum compute size. You can also configure the **Auto-suspend delay** period, which is the amount of idle time after which your read-only compute is transitioned to an idle state. The default setting is 300 seconds (5 minutes). You can set this value up to 604800 seconds (7 days).
    <Admonition type="note">
    The compute size configuration determines the processing power of your database. More vCPU and memory means more processing power but also higher compute costs. For information about compute costs, see [Billing metrics](/docs/introduction/billing).
    </Admonition>
6. When you finish making your selections, click **Create**.

Your read-only compute is provisioned and appears in the **Computes** section of the **Branches** page. This is your read replica. The following section describes how to connect to your read replica.

Alternatively, you can create read replicas using the [Neon API](https://api-docs.neon.tech/reference/createprojectendpoint) or [Neon CLI](/docs/reference/cli-branches#create).

<CodeTabs labels={["API", "CLI"]}>

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/late-bar-27572981/endpoints \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "endpoint": {
    "type": "read_only",
    "branch_id": "br-young-fire-15282225"
  }
}
' | jq
```

```bash
neonctl branches add-compute mybranch --type read_only
```

</CodeTabs>

## Connect to the read replica

Connecting to a read replica is the same as connecting to any branch, except you connect via a read-only compute endpoint instead of a read-write compute endpoint. The following steps describe how to connect to your read replica with connection details obtained from the Neon Console.

1. On the Neon **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
1. Under **Compute**, select the **RO-replica** compute endpoint.
1. Select a **Database** and the **Role** you want to connect with.
1. Copy the connection string. This is the information you need to connect to the read replica from you client or application.

    The connection string appears similar to the following:

    <CodeBlock shouldWrap>

    ```bash
    postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
    ```

    </CodeBlock>

    If you expect a high number of connections, select **Pooled connection** to add the `-pooler` flag to the connection string.

    The information in your connection string corresponds to the following connection details:

    - role: `daniel`
    - password:`<pasword>`
    - hostname: `ep-mute-rain-952417.us-east-2.aws.neon.tech`
    - database name: `neondb`. This is the ready-to-use database created with your Neon project. Your database name may differ.

    When you connect to a read-only compute, no write operations are permitted on the connection.

1. Connect to your application from a client such as `psql` or add the connection details to your application. For example, to connect using `psql`, issue the following command:

    <CodeBlock shouldWrap>

    ```bash
    psql postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
    ```

    </CodeBlock>

## Run the analytics query on the read replica

An analytics query on your `sales` table might look something like this:

```sql
SELECT product_id, SUM(sale_amount) as total_sales
FROM sales
WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 year')
GROUP BY product_id;
```

If you have a lot of products and sales, this query might impact performance on your production system, but running the query on your read replica, which has its own dedicated compute resources, causes no disruption.

## Delete the read replica

When you are finished running analytics queries, you can delete the read replica if it's no longer required. Deleting a read replica is a permanent action, but you can quickly create a new read replica when you need one.

To delete a read replica:

1. In the Neon Console, select **Branches**.
1. Select a branch.
1. Under **Computes**, find the read-only compute endpoint you want to delete. Read replicas have a `RO replica` type.
1. Click the compute endpoint menu on the right side of the table, and select **Delete**.
1. On the confirmation dialog, click **Delete**.
