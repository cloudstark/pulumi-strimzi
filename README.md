## Strimzi Resource Provider for Pulumi

The [Strimzi](https://github.com/strimzi/strimzi-kafka-operator) resource provider for Pulumi lets you
manage Kafka cluster resources in your cloud programs.

### Installing

This package is available in JavaScript/TypeScript for use with Node.js. Install it using either `npm`:

```bash
npm install @cloudstark.solutions/pulumi-strimzi
```

or `yarn`:

```bash
yarn add @cloudstark.solutions/pulumi-strimzi
```

### Quick Examples

#### Deploying the Strimzi Kafka Operator

```typescript
import * as strimzi from '@cloudstark.solutions/pulumi-strimzi';

const operator = new strimzi.kafka.KafkaOperator("strimzi", {
  repo: "strimzi",
  chart: "strimzi-kafka-operator",
  version: "0.17.0",
  namespace: "kafka"
});
```

#### Deploying a Kafka cluster

```typescript
import * as strimzi from '@cloudstark.solutions/pulumi-strimzi';

const kafka = new strimzi.kafka.v1beta1.Kafka("my-cluster", {
  metadata: {
    name: "my-cluster",
    namespace: "kafka"
  },
  spec: {
    kafka: {
      replicas: 3,
      storage: {
        type: "persistent-claim",
        size: "10Gi",
        deleteClaim: false
      },
      listeners: {
        plain: {},
        tls: {}
      },
      config: {
        'auto.create.topics.enable': false,
        'offsets.topic.replication.factor': 3,
        'transaction.state.log.replication.factor': 3,
        'transaction.state.log.min.isr': 3
      },
    },
    zookeeper: {
      replicas: 3,
      storage: {
        type: "persistent-claim",
        size: "10Gi",
        deleteClaim: false
      },
    },
    entityOperator: {
      topicOperator: {},
      userOperator: {}
    }
  }
}, {
  dependsOn: [operator]
});
```

#### Creating Kafka topics

```typescript
import * as strimzi from '@cloudstark.solutions/pulumi-strimzi';

const topic = new strimzi.kafka.v1beta1.KafkaTopic("temperature", {
  cluster: "my-cluster",
  metadata: {
    name: "temperature",
    namespace: "kafka"
  },
  spec: {
    partitions: 5,
    replicas: 3,
    config: {
      'retention.ms': '86400000'
    }
  }
}, {
  dependsOn: [operator]
});
```
## License

MIT License (Expat). See [LICENSE](LICENSE) for details.
