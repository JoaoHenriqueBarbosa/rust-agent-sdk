// class: HashUtils
class HashUtils {
  sha256(buffer) {
    return crypto9.createHash(Hash5.SHA256).update(buffer).digest();
  }
}
