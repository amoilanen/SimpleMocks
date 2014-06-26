SimpleMocks
===========

Lightweight and simple mocking library for JavaScript inspired by EasyMock and jMock

The library itself focuses only on creating mock objects, recording expectations and verifying them.

How the test code will replace some dependency with a mock is left entirely up to the test code so at to not depend on any particular testing framework.

Probably this also encourages better design on the part of the client code since not hiding the dependency manipulation inside the framework like it is done in Jasmine spys also leads to more thinking about how dependencies should be provided to the code under test and which dependencies.