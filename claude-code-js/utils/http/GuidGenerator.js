// class: GuidGenerator
class GuidGenerator {
  generateGuid() {
    return v4();
  }
  isGuid(guid3) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(guid3);
  }
}
