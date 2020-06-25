import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import {core} from "@pulumi/kubernetes/types/input";

export namespace kafka {

  export type AttributeValue = pulumi.Input<string> | pulumi.Input<boolean> | pulumi.Input<number>;

  export namespace v1beta1 {

    export interface KafkaArgs {
      metadata?: k8s.apiextensions.CustomResourceArgs['metadata'];
      spec: pulumi.Input<KafkaSpec>;
    }

    export interface KafkaConnectArgs {
      metadata?: k8s.apiextensions.CustomResourceArgs['metadata'];
      spec: pulumi.Input<KafkaConnectSpec>;
    }

    export interface KafkaSpec {
      /**
       * Configuration of the Kafka cluster.
       */
      kafka: pulumi.Input<KafkaClusterSpec>
      /**
       * Configuration of the ZooKeeper cluster.
       */
      zookeeper: pulumi.Input<ZookeeperClusterSpec>
      /**
       * Configuration of the Entity Operator
       */
      entityOperator?: pulumi.Input<EntityOperatorSpec>;
      /**
       * Configuration of the Kafka Exporter. Kafka Exporter can
       * provide additional metrics, for example lag of consumer
       * group at topic/partition.
       */
      kafkaExporter?: pulumi.Input<KafkaExporterSpec>;
      /**
       * Configuration for Cruise Control deployment. Deploys a
       * Cruise Control instance when specified.
       */
      cruiseControl?: pulumi.Input<CruiseControlSpec>;
    }

    export interface KafkaConnectSpec {
      /**
       * The number of pods in the Kafka Connect group.
       */
      replicas?: pulumi.Input<number>;
      /**
       * The Kafka Connect version. Defaults to {DefaultKafkaVersion}.
       * Consult the user documentation to understand the process required
       * to upgrade or downgrade the version.
       */
      version?: pulumi.Input<string>;
      /**
       * The docker image for the pods.
       */
      image?: pulumi.Input<string>;
      /**
       * Bootstrap servers to connect to. This should be given as
       * a comma separated list of _<hostname>_:‍_<port>_ pairs.
       */
      bootstrapServers: pulumi.Input<string>;
      /**
       * TLS configuration.
       */
      tls?: pulumi.Input<KafkaConnectTls>;
      /**
       * Authentication configuration for Kafka Connect.
       */
      authentication?: pulumi.Input<AuthenticationSpec>;
      /**
       * The Kafka Connect configuration. Properties with the following
       * prefixes cannot be set: ssl., sasl., security., listeners, plugin.path,
       * rest., bootstrap.servers, consumer.interceptor.classes, producer.interceptor.classes
       * (with the exception of: ssl.endpoint.identification.algorithm, ssl.cipher.suites,
       * ssl.protocol, ssl.enabled.protocols).
       */
      config?: pulumi.Input<{ [key: string]: pulumi.Input<AttributeValue> }>;
      /**
       * The maximum limits for CPU and memory resources and the
       * requested initial resources.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * Pod liveness checking.
       */
      livenessProbe?: pulumi.Input<Probe>;
      /**
       * Pod readiness checking.
       */
      readinessProbe?: pulumi.Input<Probe>;
      /**
       * JVM Options for pods
       */
      jvmOptions?: pulumi.Input<JvmOptions>;
      /**
       * The pod's affinity rules.
       */
      affinity?: pulumi.Input<core.v1.Affinity>;
      /**
       * The pod's tolerations.
       */
      tolerations?: pulumi.Input<core.v1.Toleration>;
      /**
       * Logging configuration for Kafka Connect.
       */
      logging?: pulumi.Input<Logging>;
      /**
       * The Prometheus JMX Exporter configuration.
       * See https://github.com/prometheus/jmx_exporter
       * for details of the structure of this configuration.
       */
      metrics?: pulumi.Input<any>;
      /**
       * The configuration of tracing in Kafka Connect.
       */
      tracing?: pulumi.Input<Tracing>;
      /**
       * Template for Kafka Connect and Kafka Connect S2I resources.
       * The template allows users to specify how the `Deployment`, `Pods`
       * and `Service` are generated.
       */
      template?: pulumi.Input<KafkaConnectTemplate>;
      /**
       * Pass data from Secrets or ConfigMaps to the Kafka Connect
       * pods and use them to configure connectors.
       */
      externalConfiguration?: pulumi.Input<any>
    }

    export interface KafkaConnectTemplate {
      /**
       * Template for Kafka Connect `Deployment`.
       */
      deployment?: pulumi.Input<ResourceTemplate>;
      /**
       * Template for Kafka Connect `Pods`.
       */
      pod?: pulumi.Input<PodTemplate>;
      /**
       * Template for Kafka Connect API `Service`.
       */
      apiService?: pulumi.Input<ResourceTemplate>;
      /**
       * Template for the Kafka Connect container.
       */
      connectContainer?: pulumi.Input<ContainerTemplate>;
      /**
       * Template for Kafka Connect `PodDisruptionBudget`.
       */
      podDisruptionBudget?: pulumi.Input<PodDisruptionBudgetTemplate>;
    }

    // TODO
    export interface ContainerTemplate {

    }

    // TODO
    export interface PodDisruptionBudgetTemplate {

    }

    // TODO
    export interface ResourceTemplate {

    }

    // TODO
    export interface Tracing {
    }

    export type LoggingType = pulumi.Input<'inline' | 'external'>;

    // TODO
    export interface Logging {
      /**
       * Logging type, must be either 'inline' or 'external'.
       */
      type: pulumi.Input<LoggingType>;
    }

    export type AuthenticationType = pulumi.Input<'tls' | 'scram-sha-512' | 'plain' | 'oauth'>

    export interface AuthenticationSpec {
      /**
       * Authentication type. Currently the only supported types
       * are `tls`, `scram-sha-512`, and `plain`. `scram-sha-512` type
       * uses SASL SCRAM-SHA-512 Authentication. `plain` type uses SASL
       * PLAIN Authentication. `oauth` type uses SASL OAUTHBEARER Authentication.
       * The `tls` type uses TLS Client Authentication. The `tls` type
       * is supported only over TLS connections.
       */
      type: pulumi.Input<AuthenticationType>;
    }

    export interface KafkaAuthorization {

    }

    export interface KafkaConnectTls {
    }

    export interface KafkaClusterSpec {
      /**
       * Authorization configuration for Kafka brokers.
       */
      authorization?: pulumi.Input<KafkaAuthorization>
      /**
       * The pod's affinity rules.
       */
      affinity?: pulumi.Input<core.v1.Affinity>;
      /**
       * 'The kafka broker config. Properties with the following
       * prefixes cannot be set: listeners, advertised., broker., listener.,
       * host.name, port, inter.broker.listener.name, sasl., ssl., security.,
       * password., principal.builder.class, log.dir, zookeeper.connect,
       * zookeeper.set.acl, authorizer., super.user, cruise.control.metrics.topic,
       * cruise.control.metrics.reporter.bootstrap.servers (with the exception
       * of: zookeeper.connection.timeout.ms, ssl.cipher.suites, ssl.protocol,
       * ssl.enabled.protocols,cruise.control.metrics.topic.num.partitions,
       * cruise.control.metrics.topic.replication.factor,
       * cruise.control.metrics.topic.retention.ms).
       */
      config?: pulumi.Input<{ [key: string]: pulumi.Input<AttributeValue> }>
      /**
       * The docker image for the pods. The default value depends
       * on the configured `Kafka.spec.kafka.version`.
       */
      image?: pulumi.Input<string>;
      /**
       * JMX Options for Kafka brokers.
       */
      jmxOptions?: pulumi.Input<KafkaJmxOptions>;
      /**
       * JVM Options for pods
       */
      jvmOptions?: pulumi.Input<JvmOptions>;
      /**
       * Configures listeners of Kafka brokers.
       */
      listeners: pulumi.Input<KafkaListeners>;
      /**
       * Pod liveness checking.
       */
      livenessProbe?: pulumi.Input<Probe>;
      /**
       * Logging configuration for Kafka.
       */
      logging?: pulumi.Input<Logging>;
      /**
       * The Prometheus JMX Exporter configuration.
       * See https://github.com/prometheus/jmx_exporter
       * for details of the structure of this configuration.
       */
      metrics?: pulumi.Input<any>;
      /**
       * Configuration of the `broker.rack` broker config.
       */
      rack?: pulumi.Input<Rack>;
      /**
       * Pod readiness checking.
       */
      readinessProbe?: pulumi.Input<Probe>;
      /**
       * The number of pods in the cluster.
       */
      replicas: pulumi.Input<number>;
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * Storage configuration (disk). Cannot be updated.
       */
      storage: pulumi.Input<KafkaStorage>;
      /**
       * Template for Kafka cluster resources. The template
       * allows users to specify how are the `StatefulSet`, `Pods` and
       * `Services` generated.
       */
      template?: pulumi.Input<KafkaClusterTemplate>;
      /**
       * The pod's tolerations.
       */
      tolerations?: pulumi.Input<core.v1.Toleration>
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
      /**
       * The kafka broker version. Defaults to {DefaultKafkaVersion}.
       * Consult the user documentation to understand the process required
       * to upgrade or downgrade the version.
       */
      version?: pulumi.Input<string>;
    }

    export interface Rack {
      /**
       * A key that matches labels assigned to the Kubernetes
       * cluster nodes. The value of the label is used to set the broker's
       * `broker.rack` config.
       */
      topologyKey: pulumi.Input<string>;
    }

    export interface JvmOptions {
      /**
       * -Xmx option to to the JVM
       */
      '-Xmx'?: pulumi.Input<string>;
      /**
       * -Xms option to to the JVM
       */
      '-Xms'?: pulumi.Input<string>;
      /**
       * -server option to to the JVM
       */
      '-server'?: pulumi.Input<boolean>;
    }

    export interface Sidecar {
      /**
       * The docker image for the container.
       */
      image?: pulumi.Input<string>;
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
    }

    export interface TlsSidecar extends Sidecar {
      /**
       * The log level for the TLS sidecar. Default value
       * is `notice`.
       */
      logLevel?: pulumi.Input<TlsSidecarLogLevel>;
      /**
       * Pod liveness checking.
       */
      livenessProbe?: pulumi.Input<Probe>;
      /**
       * Pod readiness checking.
       */
      readinessProbe?: pulumi.Input<Probe>;
    }

    export type TlsSidecarLogLevel = pulumi.Input<'emerg' | 'alert' | 'crit' | 'err' | 'warning' | 'notice' | 'info' | 'debug'>

    export type KafkaStorageType = pulumi.Input<'ephemeral' | 'persistent-claim' | 'jbod'>;

    export interface KafkaStorage {
      /**
       * Storage type, must be either 'ephemeral', 'persistent-claim',
       * or 'jbod'.
       */
      type: pulumi.Input<KafkaStorageType>;
      /**
       * The storage class to use for dynamic volume allocation.
       */
      class?: pulumi.Input<string>;
      /**
       * When type=persistent-claim, defines the size of the persistent
       * volume claim (i.e 1Gi). Mandatory when type=persistent-claim.
       */
      size?: pulumi.Input<string>
      /**
       * Specifies if the persistent volume claim has to
       * be deleted when the cluster is un-deployed.
       */
      deleteClaim?: pulumi.Input<boolean>
    }

    export interface KafkaListeners {
      /**
       * Configures plain listener on port 9092.
       */
      plain?: pulumi.Input<PlainListener>;
      /**
       * Configures TLS listener on port 9093.
       */
      tls?: pulumi.Input<TlsListener>;
      /**
       * Configures external listener on port 9094.
       */
      external?: pulumi.Input<ExternalListener>;
    }

    export interface PlainListener {
    }

    export interface TlsListener {
    }

    export interface ExternalListener {

    }

    export interface KafkaClusterTemplate {
      /**
       * Template for Kafka `Pods`.
       */
      pod?: pulumi.Input<PodTemplate>;
    }

    export interface Probe {
      /**
       * Minimum consecutive failures for the probe to be considered
       * failed after having succeeded. Defaults to 3. Minimum value is 1.
       */
      failureThreshold?: pulumi.Input<number>;
      /**
       * The initial delay before first the health is first checked.
       */
      initialDelaySeconds?: pulumi.Input<number>;
      /**
       * How often (in seconds) to perform the probe. Default
       * to 10 seconds. Minimum value is 1.
       */
      periodSeconds?: pulumi.Input<number>;
      /**
       * Minimum consecutive successes for the probe to
       * be considered successful after having failed. Defaults to
       * 1. Must be 1 for liveness. Minimum value is 1.
       */
      successThreshold?: pulumi.Input<number>;
      /**
       * The timeout for each attempted health check.
       */
      timeoutSeconds?: pulumi.Input<number>;
    }

    export interface PodTemplate {
      /**
       * Metadata applied to the resource.
       */
      metadata?: pulumi.Input<{
        /**
         * Labels which should be added to the resource
         * template. Can be applied to different resources such
         * as `StatefulSets`, `Deployments`, `Pods`, and `Services`.
         */
        labels?: pulumi.Input<any>;
        /**
         * Annotations which should be added to the
         * resource template. Can be applied to different resources
         * such as `StatefulSets`, `Deployments`, `Pods`, and
         * `Services`.
         */
        annotations?: pulumi.Input<any>;
      }>;
      /**
       * List of references to secrets in the same namespace
       * to use for pulling any of the images used by this Pod.
       */
      imagePullSecrets?: pulumi.Input<Array<pulumi.Input<core.v1.LocalObjectReference>>>;

      affinity?: pulumi.Input<core.v1.Affinity>;
    }

    export interface ZookeeperClusterSpec {
      /**
       * The pod's affinity rules.
       */
      affinity?: pulumi.Input<core.v1.Affinity>;
      /**
       * The number of pods in the cluster.
       */
      replicas: pulumi.Input<number>;
      /**
       * The docker image for the pods.
       */
      image?: pulumi.Input<string>;
      /**
       * Storage configuration (disk). Cannot be updated.
       */
      storage: pulumi.Input<ZookeeperStorage>;
      /**
       * The Prometheus JMX Exporter configuration.
       * See https://github.com/prometheus/jmx_exporter
       * for details of the structure of this configuration.
       */
      metrics?: pulumi.Input<any>;
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * Template for ZooKeeper cluster resources. The template
       * allows users to specify how are the `StatefulSet`, `Pods` and
       * `Services` generated.
       */
      template?: pulumi.Input<ZookeeperClusterTemplate>;
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
    }

    export type ZookeeperStorageType = pulumi.Input<'ephemeral' | 'persistent-claim'>;

    export interface ZookeeperStorage {
      /**
       * Storage type, must be either 'ephemeral' or 'persistent-claim'.
       */
      type: pulumi.Input<ZookeeperStorageType>;
      /**
       * The storage class to use for dynamic volume allocation.
       */
      class?: pulumi.Input<string>;
      /**
       * When type=persistent-claim, defines the size of the persistent
       * volume claim (i.e 1Gi). Mandatory when type=persistent-claim.
       */
      size?: pulumi.Input<string>
      /**
       * Specifies if the persistent volume claim has to
       * be deleted when the cluster is un-deployed.
       */
      deleteClaim?: pulumi.Input<boolean>
    }

    export interface EntityOperatorSpec {
      /**
       * The pod's affinity rules.
       */
      affinity?: pulumi.Input<core.v1.Affinity>;
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
      /**
       * Configuration of the Topic Operator.
       */
      topicOperator?: pulumi.Input<EntityTopicOperatorSpec>;
      /**
       * Configuration of the User Operator.
       */
      userOperator?: pulumi.Input<EntityUserOperatorSpec>;
    }

    export interface EntityTopicOperatorSpec {
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
      /**
       * The image to use for the Topic Operator.
       */
      image?: pulumi.Input<string>;
    }

    export interface EntityUserOperatorSpec {
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * TLS sidecar configuration.
       */
      tlsSidecar?: pulumi.Input<TlsSidecar>;
      /**
       * The image to use for the User Operator.
       */
      image?: pulumi.Input<string>;
    }

    // TODO
    export interface CruiseControlSpec {
      /**
       * The docker image for the pods.
       */
      image?: pulumi.Input<string>;
    }

    export interface KafkaExporterSpec {
      /**
       * The docker image for the pods.
       */
      image?: pulumi.Input<string>;
      /**
       * Regular expression to specify which consumer groups
       * to collect. Default value is `.*`.
       */
      groupRegex?: pulumi.Input<string>;
      /**
       * Regular expression to specify which topics to collect.
       * Default value is `.*`.
       */
      topicRegex?: pulumi.Input<string>;
      /**
       * CPU and memory resources to reserve.
       */
      resources?: pulumi.Input<core.v1.ResourceRequirements>;
      /**
       * Customization of deployment templates and pods.
       */
      template?: pulumi.Input<KafkaExporterTemplate>;
      /**
       * Pod liveness check.
       */
      livenessProbe?: pulumi.Input<Probe>;
      /**
       * Pod readiness check.
       */
      readinessProbe?: pulumi.Input<Probe>;
    }

    export interface ZookeeperClusterTemplate {
      /**
       * Template for ZooKeeper `Pods`.
       */
      pod?: pulumi.Input<PodTemplate>;
    }

    export interface KafkaJmxAuthentication {

    }

    export interface KafkaJmxOptions {
      /**
       * Authentication configuration for connecting to
       * the Kafka JMX port.
       */
      authentication?: pulumi.Input<KafkaJmxAuthentication>;
    }

    // TODO
    export interface KafkaExporterTemplate {
      /**
       * Template for Kafka Exporter `Pods`.
       */
      pod?: pulumi.Input<PodTemplate>;
    }

    export interface KafkaTopicArgs {
      cluster: pulumi.Input<string>,
      metadata?: k8s.apiextensions.CustomResourceArgs['metadata'];
      spec: pulumi.Input<TopicArgs>;
    }


    export interface TopicArgs {
      /**
       * The number of partitions the topic should have. This cannot
       * be decreased after topic creation. It can be increased after topic
       * creation, but it is important to understand the consequences that
       * has, especially for topics with semantic partitioning.
       */
      partitions: pulumi.Input<number>;
      /**
       * The number of replicas the topic should have.
       */
      replicas: pulumi.Input<number>;
      /**
       * The topic configuration.
       */
      config?: pulumi.Input<{ [key: string]: pulumi.Input<AttributeValue> }>
      /**
       * The name of the topic. When absent this will default to
       * the metadata.name of the topic. It is recommended to not set this
       * unless the topic name is not a valid Kubernetes resource name.
       */
      topicName?: pulumi.Input<string>;
    }
  }

  export namespace v1alpha1 {

    export interface KafkaConnectorArgs {
      cluster: pulumi.Input<string>,
      metadata?: k8s.apiextensions.CustomResourceArgs['metadata'];
      spec: pulumi.Input<KafkaConnectorSpec>;
    }

    export interface KafkaConnectorSpec {
      /**
       * The Class for the Kafka Connector.
       */
      class: pulumi.Input<string>;
      /**
       * The maximum number of tasks for the Kafka Connector.
       */
      tasksMax: pulumi.Input<number>;
      /**
       * The Kafka Connector configuration. The following properties
       * cannot be set: connector.class, tasks.max.
       */
      config: pulumi.Input<{ [key: string]: pulumi.Input<AttributeValue> }>
      /**
       * Whether the connector should be paused. Defaults to false.
       */
      pause?: pulumi.Input<boolean>;
    }
  }
}
