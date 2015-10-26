describe("nested describe", function() {

  describe("success", function() {
    it ("should pass for the example", function() {
      expect(true).toBeTruthy();
    });
  });

  describe("failure", function() {
    it ("should fail for the example", function() {
      expect(false).toBeTruthy();
    });
  });

  describe("mixed", function() {
    it ("should fail for the example", function() {
      expect(false).toBeTruthy();
    });

    it ("should fail for the example", function() {
      expect(false).toBeTruthy();
    });

    it ("should pass for the example", function() {
      expect(true).toBeTruthy();
    });
  });
});
