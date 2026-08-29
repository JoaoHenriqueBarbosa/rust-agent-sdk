// var: require_dist_cjs51
var require_dist_cjs51 = __commonJS((exports) => {
  var utilEndpoints = require_dist_cjs50(), urlParser = require_dist_cjs11(), isVirtualHostableS3Bucket = (value, allowSubDomains = !1) => {
    if (allowSubDomains) {
      for (let label of value.split("."))
        if (!isVirtualHostableS3Bucket(label))
          return !1;
      return !0;
    }
    if (!utilEndpoints.isValidHostLabel(value))
      return !1;
    if (value.length < 3 || value.length > 63)
      return !1;
    if (value !== value.toLowerCase())
      return !1;
    if (utilEndpoints.isIpAddress(value))
      return !1;
    return !0;
  }, ARN_DELIMITER = ":", RESOURCE_DELIMITER = "/", parseArn = (value) => {
    let segments = value.split(ARN_DELIMITER);
    if (segments.length < 6)
      return null;
    let [arn, partition3, service, region, accountId, ...resourcePath] = segments;
    if (arn !== "arn" || partition3 === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "")
      return null;
    let resourceId = resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat();
    return {
      partition: partition3,
      service,
      region,
      accountId,
      resourceId
    };
  }, partitions = [
    {
      id: "aws",
      outputs: {
        dnsSuffix: "amazonaws.com",
        dualStackDnsSuffix: "api.aws",
        implicitGlobalRegion: "us-east-1",
        name: "aws",
        supportsDualStack: !0,
        supportsFIPS: !0
      },
      regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
      regions: {
        "af-south-1": {
          description: "Africa (Cape Town)"
        },
        "ap-east-1": {
          description: "Asia Pacific (Hong Kong)"
        },
        "ap-east-2": {
          description: "Asia Pacific (Taipei)"
        },
        "ap-northeast-1": {
          description: "Asia Pacific (Tokyo)"
        },
        "ap-northeast-2": {
          description: "Asia Pacific (Seoul)"
        },
        "ap-northeast-3": {
          description: "Asia Pacific (Osaka)"
        },
        "ap-south-1": {
          description: "Asia Pacific (Mumbai)"
        },
        "ap-south-2": {
          description: "Asia Pacific (Hyderabad)"
        },
        "ap-southeast-1": {
          description: "Asia Pacific (Singapore)"
        },
        "ap-southeast-2": {
          description: "Asia Pacific (Sydney)"
        },
        "ap-southeast-3": {
          description: "Asia Pacific (Jakarta)"
        },
        "ap-southeast-4": {
          description: "Asia Pacific (Melbourne)"
        },
        "ap-southeast-5": {
          description: "Asia Pacific (Malaysia)"
        },
        "ap-southeast-6": {
          description: "Asia Pacific (New Zealand)"
        },
        "ap-southeast-7": {
          description: "Asia Pacific (Thailand)"
        },
        "aws-global": {
          description: "aws global region"
        },
        "ca-central-1": {
          description: "Canada (Central)"
        },
        "ca-west-1": {
          description: "Canada West (Calgary)"
        },
        "eu-central-1": {
          description: "Europe (Frankfurt)"
        },
        "eu-central-2": {
          description: "Europe (Zurich)"
        },
        "eu-north-1": {
          description: "Europe (Stockholm)"
        },
        "eu-south-1": {
          description: "Europe (Milan)"
        },
        "eu-south-2": {
          description: "Europe (Spain)"
        },
        "eu-west-1": {
          description: "Europe (Ireland)"
        },
        "eu-west-2": {
          description: "Europe (London)"
        },
        "eu-west-3": {
          description: "Europe (Paris)"
        },
        "il-central-1": {
          description: "Israel (Tel Aviv)"
        },
        "me-central-1": {
          description: "Middle East (UAE)"
        },
        "me-south-1": {
          description: "Middle East (Bahrain)"
        },
        "mx-central-1": {
          description: "Mexico (Central)"
        },
        "sa-east-1": {
          description: "South America (Sao Paulo)"
        },
        "us-east-1": {
          description: "US East (N. Virginia)"
        },
        "us-east-2": {
          description: "US East (Ohio)"
        },
        "us-west-1": {
          description: "US West (N. California)"
        },
        "us-west-2": {
          description: "US West (Oregon)"
        }
      }
    },
    {
      id: "aws-cn",
      outputs: {
        dnsSuffix: "amazonaws.com.cn",
        dualStackDnsSuffix: "api.amazonwebservices.com.cn",
        implicitGlobalRegion: "cn-northwest-1",
        name: "aws-cn",
        supportsDualStack: !0,
        supportsFIPS: !0
      },
      regionRegex: "^cn\\-\\w+\\-\\d+$",
      regions: {
        "aws-cn-global": {
          description: "aws-cn global region"
        },
        "cn-north-1": {
          description: "China (Beijing)"
        },
        "cn-northwest-1": {
          description: "China (Ningxia)"
        }
      }
    },
    {
      id: "aws-eusc",
      outputs: {
        dnsSuffix: "amazonaws.eu",
        dualStackDnsSuffix: "api.amazonwebservices.eu",
        implicitGlobalRegion: "eusc-de-east-1",
        name: "aws-eusc",
        supportsDualStack: !0,
        supportsFIPS: !0
      },
      regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
      regions: {
        "eusc-de-east-1": {
          description: "AWS European Sovereign Cloud (Germany)"
        }
      }
    },
    {
      id: "aws-iso",
      outputs: {
        dnsSuffix: "c2s.ic.gov",
        dualStackDnsSuffix: "api.aws.ic.gov",
        implicitGlobalRegion: "us-iso-east-1",
        name: "aws-iso",
        supportsDualStack: !0,
        supportsFIPS: !0
      },
      regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
      regions: {
        "aws-iso-global": {
          description: "aws-iso global region"
        },
        "us-iso-east-1": {
          description: "US ISO East"
        },
        "us-iso-west-1": {
          description: "US ISO WEST"
        }
      }
    },
    {
      id: "aws-iso-b",
      outputs: {
        dnsSuffix: "sc2s.sgov.gov",
        dualStackDnsSuffix: "api.aws.scloud",
        implicitGlobalRegion: "us-isob-east-1",
        name: "aws-iso-b",
        supportsDualStack: !0,
        supportsFIPS: !0
      },
      regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
      regions: {
        "aws-iso-b-global": {
          description: "aws-iso-b global region"
        },
        "us-isob-east-1": {
          description: "US ISOB East (Ohio)"
        },
        "us-isob-west-1": {
          description: "US ISOB West"
        }
      }
    },
    {
      id: "aws-iso-e",
      outputs: {
        dnsSuffix: "cloud.adc-e.uk",
        dualStackDnsSuffix: "api.cloud-aws.adc-e.uk",
        implicitGlobalRegion: "eu-isoe-west-1",
        name: "aws-iso-e",
        supportsDualStack: !0,
        supportsFIPS: !0
      },
      regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
      regions: {
        "aws-iso-e-global": {
          description: "aws-iso-e global region"
        },
        "eu-isoe-west-1": {
          description: "EU ISOE West"
        }
      }
    },
    {
      id: "aws-iso-f",
      outputs: {
        dnsSuffix: "csp.hci.ic.gov",
        dualStackDnsSuffix: "api.aws.hci.ic.gov",
        implicitGlobalRegion: "us-isof-south-1",
        name: "aws-iso-f",
        supportsDualStack: !0,
        supportsFIPS: !0
      },
      regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
      regions: {
        "aws-iso-f-global": {
          description: "aws-iso-f global region"
        },
        "us-isof-east-1": {
          description: "US ISOF EAST"
        },
        "us-isof-south-1": {
          description: "US ISOF SOUTH"
        }
      }
    },
    {
      id: "aws-us-gov",
      outputs: {
        dnsSuffix: "amazonaws.com",
        dualStackDnsSuffix: "api.aws",
        implicitGlobalRegion: "us-gov-west-1",
        name: "aws-us-gov",
        supportsDualStack: !0,
        supportsFIPS: !0
      },
      regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
      regions: {
        "aws-us-gov-global": {
          description: "aws-us-gov global region"
        },
        "us-gov-east-1": {
          description: "AWS GovCloud (US-East)"
        },
        "us-gov-west-1": {
          description: "AWS GovCloud (US-West)"
        }
      }
    }
  ], version2 = "1.1", partitionsInfo = {
    partitions,
    version: version2
  }, selectedPartitionsInfo = partitionsInfo, selectedUserAgentPrefix = "", partition2 = (value) => {
    let { partitions: partitions2 } = selectedPartitionsInfo;
    for (let partition3 of partitions2) {
      let { regions, outputs } = partition3;
      for (let [region, regionData] of Object.entries(regions))
        if (region === value)
          return {
            ...outputs,
            ...regionData
          };
    }
    for (let partition3 of partitions2) {
      let { regionRegex, outputs } = partition3;
      if (new RegExp(regionRegex).test(value))
        return {
          ...outputs
        };
    }
    let DEFAULT_PARTITION = partitions2.find((partition3) => partition3.id === "aws");
    if (!DEFAULT_PARTITION)
      throw Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
    return {
      ...DEFAULT_PARTITION.outputs
    };
  }, setPartitionInfo = (partitionsInfo2, userAgentPrefix = "") => {
    selectedPartitionsInfo = partitionsInfo2, selectedUserAgentPrefix = userAgentPrefix;
  }, useDefaultPartitionInfo = () => {
    setPartitionInfo(partitionsInfo, "");
  }, getUserAgentPrefix = () => selectedUserAgentPrefix, awsEndpointFunctions = {
    isVirtualHostableS3Bucket,
    parseArn,
    partition: partition2
  };
  utilEndpoints.customEndpointFunctions.aws = awsEndpointFunctions;
  var resolveDefaultAwsRegionalEndpointsConfig = (input) => {
    if (typeof input.endpointProvider !== "function")
      throw Error("@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.");
    let { endpoint: endpoint2 } = input;
    if (endpoint2 === void 0)
      input.endpoint = async () => {
        return toEndpointV1(input.endpointProvider({
          Region: typeof input.region === "function" ? await input.region() : input.region,
          UseDualStack: typeof input.useDualstackEndpoint === "function" ? await input.useDualstackEndpoint() : input.useDualstackEndpoint,
          UseFIPS: typeof input.useFipsEndpoint === "function" ? await input.useFipsEndpoint() : input.useFipsEndpoint,
          Endpoint: void 0
        }, { logger: input.logger }));
      };
    return input;
  }, toEndpointV1 = (endpoint2) => urlParser.parseUrl(endpoint2.url);
  exports.EndpointError = utilEndpoints.EndpointError;
  exports.isIpAddress = utilEndpoints.isIpAddress;
  exports.resolveEndpoint = utilEndpoints.resolveEndpoint;
  exports.awsEndpointFunctions = awsEndpointFunctions;
  exports.getUserAgentPrefix = getUserAgentPrefix;
  exports.partition = partition2;
  exports.resolveDefaultAwsRegionalEndpointsConfig = resolveDefaultAwsRegionalEndpointsConfig;
  exports.setPartitionInfo = setPartitionInfo;
  exports.toEndpointV1 = toEndpointV1;
  exports.useDefaultPartitionInfo = useDefaultPartitionInfo;
});
