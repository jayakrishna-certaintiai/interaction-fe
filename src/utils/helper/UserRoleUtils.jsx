export const flattenRolesData = (data) => {
  const flatData = [];
  data?.roleFeatures?.forEach((feature) => {
    feature?.permissions?.forEach((permission) => {
      flatData.push({
        roleId: data?.roleId,
        featureId: feature?.featureId,
        permissionId: permission?.permissionId,
        status: permission?.status ? "1" : "0",
      });
    });
  });

  return flatData;
};

export const getFeaturePermissionStatus = (
  selectedEditRoleState,
  roleId,
  featureId,
  permissionId
) => {
  const result = selectedEditRoleState?.find(
    (item) =>
      item.roleId === roleId &&
      item.featureId === featureId &&
      item.permissionId === permissionId
  );
  return result?.status === "1" ? true : false;
};

export const getFeaturePermissionAddStatus = (
  selectedAddRoleState,
  featureId,
  permissionId
) => {
  const result = selectedAddRoleState?.find(
    (item) => item.featureId === featureId && item.permissionId === permissionId
  );
  return result?.status === "1" ? true : false;
};
export const flattenAddRolesData = (data) => {
  const flatData = [];
  data?.roleFeatures?.forEach((feature) => {
    feature?.permissions?.forEach((permission) => {
      flatData.push({
        featureId: feature?.featureId,
        permissionId: permission?.permissionId,
        status: "0",
      });
    });
  });

  return flatData;
};
